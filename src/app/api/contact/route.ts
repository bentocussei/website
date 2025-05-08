import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, subject, message } = data;

    // Validação básica
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Criando o objeto da mensagem
    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      subject: subject || "", // Campo opcional
      message,
      timestamp: new Date().toISOString(),
    };

    // Caminho para o arquivo JSON
    const filePath = path.join(process.cwd(), "data", "contact-messages.json");

    // Ler o arquivo existente ou criar um novo array
    let messages = [];
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      messages = JSON.parse(fileContent);
    } catch (error) {
      // Se o arquivo não existe ou não pode ser lido, começamos com um array vazio
      console.log("Creating new contact messages file");
    }

    // Adicionar a nova mensagem
    messages.push(newMessage);

    // Salvar de volta ao arquivo
    await fs.writeFile(filePath, JSON.stringify(messages, null, 2), "utf-8");

    return NextResponse.json(
      { success: true, message: "Contact message saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { error: "Failed to save contact message" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "contact-messages.json");
    
    // Ler o arquivo existente ou retornar array vazio
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      const messages = JSON.parse(fileContent);
      return NextResponse.json({ messages }, { status: 200 });
    } catch (error) {
      // Se o arquivo não existe, retornamos um array vazio
      return NextResponse.json({ messages: [] }, { status: 200 });
    }
  } catch (error) {
    console.error("Error reading contact messages:", error);
    return NextResponse.json(
      { error: "Failed to read contact messages" },
      { status: 500 }
    );
  }
} 