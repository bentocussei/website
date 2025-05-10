import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Listar todas as notícias
export async function GET() {
  try {
    const newsItems = await prisma.news.findMany({
      orderBy: [
        {
          date: 'desc', // Idealmente, 'date' deveria ser DateTime no schema para ordenação correta
        },
        {
          createdAt: 'desc', // Fallback para createdAt se as datas forem strings iguais
        }
      ],
    });
    return NextResponse.json({ news: newsItems }, { status: 200 });
  } catch (error) {
    console.error("Error fetching news items:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { error: "Failed to fetch news items. Please try again later.", details: errorMessage },
      { status: 500 }
    );
  }
}

// Criar uma nova notícia (protegido, somente admin)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Verificar se o usuário está autenticado e é admin
    if (!session || !(session.user as any).isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { title, date, summary, content, image } = data;

    // Validação básica
    if (!title || !date || !summary || !content) {
      return NextResponse.json(
        { error: "Title, date, summary, and content are required" },
        { status: 400 }
      );
    }

    // Criar nova notícia
    const newNews = await prisma.news.create({
      data: {
        title,
        date,
        summary,
        content,
        image: image || null,
      },
    });

    return NextResponse.json(
      { success: true, message: "News created successfully", id: newNews.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { error: "Failed to create news" },
      { status: 500 }
    );
  }
} 