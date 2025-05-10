import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activityLogger";

// Listar todas as notícias (público)
export async function GET() {
  // GET não precisa de IP/User-Agent para log se for totalmente público
  // Se fosse protegido, ou para fins de auditoria de acesso, poderia ser adicionado.
  try {
    const newsItems = await prisma.news.findMany({
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' }
      ],
      // Removido include: { author: ... } pois não há mais relação direta
    });
    // Log de acesso (opcional, se necessário para todas as visualizações de notícias)
    // await logActivity({ action: "NEWS_LIST_VIEWED_PUBLIC" }); 
    return NextResponse.json({ news: newsItems }, { status: 200 });
  } catch (error) {
    console.error("Error fetching news items:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    // Log de falha de sistema (opcional)
    // await logActivity({ action: "NEWS_LIST_VIEW_PUBLIC_FAILED", details: { error: errorMessage } });
    return NextResponse.json(
      { error: "Failed to fetch news items. Please try again later.", details: errorMessage },
      { status: 500 }
    );
  }
}

// Criar uma nova notícia (protegido, somente admin)
export async function POST(request: NextRequest) {
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || null;
  const userAgent = request.headers.get("user-agent") || null;
  let sessionUserId: string | undefined = undefined;

  try {
    const session = await getServerSession(authOptions);
    sessionUserId = (session?.user as any)?.id;
    const userIsAdmin = (session?.user as any)?.isAdmin;

    if (!session || !userIsAdmin || !sessionUserId) {
      await logActivity({
        action: "NEWS_CREATE_ATTEMPT_UNAUTHORIZED",
        ipAddress,
        userAgent,
      });
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { title, date, summary, content, image } = data;

    if (!title || !date || !summary || !content) {
      return NextResponse.json(
        { error: "Title, date, summary, and content are required" },
        { status: 400 }
      );
    }

    const newNews = await prisma.news.create({
      data: {
        title,
        date,
        summary,
        content,
        image: image || null,
        // Removido author: { connect: { id: sessionUserId } } ou authorId: sessionUserId
      },
      // Removido include: { author: true } pois não há mais autor direto no modelo
    });

    await logActivity({
      userId: sessionUserId, // O admin que criou
      action: "NEWS_CREATE",
      entityType: "News",
      entityId: newNews.id,
      details: { title: newNews.title }, // Não há mais authorId para logar aqui diretamente do objeto news
      ipAddress,
      userAgent,
    });

    return NextResponse.json(
      { success: true, message: "News created successfully", news: newNews },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating news:", error);
    await logActivity({
      userId: sessionUserId, 
      action: "NEWS_CREATE_FAILED",
      details: { error: error instanceof Error ? error.message : String(error) },
      ipAddress,
      userAgent,
    });
    return NextResponse.json(
      { error: "Failed to create news" },
      { status: 500 }
    );
  }
} 