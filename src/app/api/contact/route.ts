import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, subject, message } = data;

    // Validação básica
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    // Opcional: Validação de email mais robusta aqui se necessário

    const newContactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || null, // Assunto é opcional no schema
        message,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully!",
        id: newContactMessage.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving contact message:", error);
    // Verificar se o erro é uma instância de Error para acessar a propriedade message
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { error: "Failed to send message. Please try again later.", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Adicionar autenticação/autorização aqui (ex: verificar se é admin)
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        timestamp: "desc",
      },
    });
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages." },
      { status: 500 }
    );
  }
} 