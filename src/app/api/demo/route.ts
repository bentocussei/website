import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, company } = data;

    // Validação básica
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Criando o objeto da solicitação
    const newRequest = {
      id: Date.now().toString(),
      name,
      email,
      company: company || "", // Campo opcional
      timestamp: new Date().toISOString(),
    };

    // Caminho para o arquivo JSON
    const filePath = path.join(process.cwd(), "data", "demo-requests.json");

    // Ler o arquivo existente ou criar um novo array
    let requests = [];
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      requests = JSON.parse(fileContent);
    } catch (error) {
      // Se o arquivo não existe ou não pode ser lido, começamos com um array vazio
      console.log("Creating new demo requests file");
    }

    // Adicionar a nova solicitação
    requests.push(newRequest);

    // Salvar de volta ao arquivo
    await fs.writeFile(filePath, JSON.stringify(requests, null, 2), "utf-8");

    return NextResponse.json(
      { success: true, message: "Demo request saved successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving demo request:", error);
    return NextResponse.json(
      { error: "Failed to save demo request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "demo-requests.json");
    
    // Ler o arquivo existente ou retornar array vazio
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      const requests = JSON.parse(fileContent);
      return NextResponse.json({ requests }, { status: 200 });
    } catch (error) {
      // Se o arquivo não existe, retornamos um array vazio
      return NextResponse.json({ requests: [] }, { status: 200 });
    }
  } catch (error) {
    console.error("Error reading demo requests:", error);
    return NextResponse.json(
      { error: "Failed to read demo requests" },
      { status: 500 }
    );
  }
} 