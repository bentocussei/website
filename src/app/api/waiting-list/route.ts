import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, name, companyName, productName: inputProductName, productVersion, isDemoRequest = false } = data;

    // Determinar o productName final
    const finalProductName = isDemoRequest ? (inputProductName || "SmartGridLab") : inputProductName;

    // Validação básica
    if (!email || !finalProductName) {
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

    const message = isDemoRequest 
      ? "Demo request saved successfully" 
      : "Added to waiting list successfully";

    return NextResponse.json(
      { success: true, message, id: newEntry.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Buscar todas as entradas da lista de espera
    const entries = await prisma.waitingList.findMany({
      orderBy: {
        registrationTimestamp: 'desc'
      }
    });
    
    return NextResponse.json({ entries }, { status: 200 });
  } catch (error) {
    console.error("Error fetching waiting list:", error);
    return NextResponse.json(
      { error: "Failed to fetch waiting list" },
      { status: 500 }
    );
  }
} 