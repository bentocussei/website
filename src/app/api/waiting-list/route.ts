import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activityLogger";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || null;
  const userAgent = request.headers.get("user-agent") || null;

  try {
    const data = await request.json();
    const { email, name, companyName, productName: inputProductName, productVersion, isDemoRequest = false } = data;

    // Determinar o productName final
    const finalProductName = isDemoRequest ? (inputProductName || "Virtual Twin Platform") : inputProductName;

    // Validação básica
    if (!email || !finalProductName) {
      await logActivity({
        action: isDemoRequest ? "DEMO_REQUEST_VALIDATION_FAILED" : "WAITING_LIST_VALIDATION_FAILED",
        details: { error: "Email and product name are required", payload: data },
        ipAddress,
        userAgent,
      });
      return NextResponse.json(
        { error: "Email and product name are required" },
        { status: 400 }
      );
    }

    // Verificar se o email já está na lista de espera para o mesmo tipo de solicitação ou produto
    // Esta lógica pode precisar ser ajustada dependendo dos requisitos de negócios.
    // Por enquanto, manteremos a verificação original apenas por e-mail para simplicidade na consolidação.
    const existingEntry = await prisma.waitingList.findUnique({
      where: { email },
    });

    if (existingEntry) {
      // Se já existe e estamos tentando adicionar para o mesmo tipo (demo ou não) ou se não especificamos o tipo na entrada existente
      // Ou se é uma nova tentativa de adicionar à lista geral quando já existe como demo, ou vice-versa.
      // A lógica aqui pode ser complexa. Simplificando: se o email existe, não permitir duplicados por enquanto.
      // No futuro, pode-se permitir que um email esteja na lista de espera para um produto e também solicite uma demo.
      await logActivity({
        action: isDemoRequest ? "DEMO_REQUEST_DUPLICATE_EMAIL" : "WAITING_LIST_DUPLICATE_EMAIL",
        entityType: "WaitingList",
        entityId: existingEntry.id,
        details: { email, name, companyName, productName: finalProductName },
        ipAddress,
        userAgent,
      });
      return NextResponse.json(
        { error: "Email already in waiting list", id: existingEntry.id },
        { status: 409 }
      );
    }

    // Criar nova entrada na lista de espera
    const newEntry = await prisma.waitingList.create({
      data: {
        email,
        name: name || null,
        companyName: companyName || null,
        productName: finalProductName,
        productVersion: productVersion || null,
        isDemoRequest: isDemoRequest,
      },
    });

    const logAction = isDemoRequest ? "DEMO_REQUEST_CREATE_SUCCESS" : "WAITING_LIST_CREATE_SUCCESS";
    await logActivity({
      action: logAction,
      entityType: "WaitingList",
      entityId: newEntry.id,
      details: { email: newEntry.email, name: newEntry.name, companyName: newEntry.companyName, productName: newEntry.productName, isDemo: newEntry.isDemoRequest },
      ipAddress,
      userAgent,
    });

    const message = isDemoRequest 
      ? "Demo request saved successfully" 
      : "Added to waiting list successfully";

    return NextResponse.json(
      { success: true, message, id: newEntry.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing waiting list/demo request:", error);
    const dataForLogError = await request.json().catch(() => ({})); // Tentar obter o corpo da requisição para o log de erro
    await logActivity({
      action: "WAITING_LIST_OR_DEMO_REQUEST_FAILED",
      details: { error: error instanceof Error ? error.message : String(error), payload: dataForLogError },
      ipAddress,
      userAgent,
    });
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || null;
  const userAgent = request.headers.get("user-agent") || null;
  // Este GET é público? Ou deveria ser protegido e logar quem acessou?
  // Por ora, vou adicionar um log genérico de acesso se necessário, ou proteger.
  // Assumindo que é para admin e deve ser protegido:
  const session = await getServerSession(authOptions); // Precisaria de authOptions
  if (!(session?.user as any)?.isAdmin) {
    await logActivity({
      action: "WAITING_LIST_VIEW_UNAUTHORIZED",
      ipAddress,
      userAgent,
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Buscar todas as entradas da lista de espera
    const entries = await prisma.waitingList.findMany({
      orderBy: {
        registrationTimestamp: 'desc'
      }
    });
    
    await logActivity({
      userId: (session?.user as any)?.id,
      action: "WAITING_LIST_VIEW_SUCCESS",
      details: { count: entries.length },
      ipAddress,
      userAgent,
    });
    return NextResponse.json({ entries }, { status: 200 });
  } catch (error) {
    console.error("Error fetching waiting list:", error);
    await logActivity({
      userId: (session?.user as any)?.id,
      action: "WAITING_LIST_VIEW_FAILED",
      details: { error: error instanceof Error ? error.message : String(error) },
      ipAddress,
      userAgent,
    });
    return NextResponse.json(
      { error: "Failed to fetch waiting list" },
      { status: 500 }
    );
  }
} 