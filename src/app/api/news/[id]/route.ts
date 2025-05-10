import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activityLogger";

// Obter uma notícia específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || null;
  const userAgent = request.headers.get("user-agent") || null;
  let sessionUserId: string | undefined = undefined;

  try {
    const session = await getServerSession(authOptions);
    sessionUserId = (session?.user as any)?.id;
    const { id } = params;

    const news = await prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      await logActivity({
        userId: sessionUserId,
        action: "NEWS_VIEW_NOT_FOUND",
        entityType: "News",
        entityId: id,
        ipAddress,
        userAgent,
      });
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }

    await logActivity({
      userId: sessionUserId,
      action: "NEWS_VIEW",
      entityType: "News",
      entityId: news.id,
      details: { title: news.title },
      ipAddress,
      userAgent,
    });
    return NextResponse.json({ news }, { status: 200 });
  } catch (error) {
    console.error("Error fetching news by id:", error);
    await logActivity({
      userId: sessionUserId,
      action: "NEWS_VIEW_FAILED",
      entityType: "News",
      entityId: params.id,
      details: { error: error instanceof Error ? error.message : String(error) },
      ipAddress,
      userAgent,
    });
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

// Atualizar uma notícia específica (protegido, somente admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || null;
  const userAgent = request.headers.get("user-agent") || null;
  let sessionUserId: string | undefined = undefined;

  try {
    const session = await getServerSession(authOptions);
    sessionUserId = (session?.user as any)?.id;
    const userIsAdmin = (session?.user as any)?.isAdmin;

    if (!session || !userIsAdmin || !sessionUserId) {
      await logActivity({
        action: "NEWS_UPDATE_ATTEMPT_UNAUTHORIZED",
        entityType: "News",
        entityId: params.id,
        ipAddress,
        userAgent,
      });
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const data = await request.json();
    const { title, date, summary, content, image } = data;

    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      await logActivity({
        userId: sessionUserId,
        action: "NEWS_UPDATE_NOT_FOUND",
        entityType: "News",
        entityId: id,
        ipAddress,
        userAgent,
      });
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingNews.title,
        date: date !== undefined ? date : existingNews.date,
        summary: summary !== undefined ? summary : existingNews.summary,
        content: content !== undefined ? content : existingNews.content,
        image: image !== undefined ? image : existingNews.image,
      },
    });

    await logActivity({
      userId: sessionUserId,
      action: "NEWS_UPDATE",
      entityType: "News",
      entityId: updatedNews.id,
      details: { title: updatedNews.title, changes: data },
      ipAddress,
      userAgent,
    });

    return NextResponse.json(
      { success: true, message: "News updated successfully", news: updatedNews },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating news:", error);
    const requestBodyForLog = await request.text();
    await logActivity({
      userId: sessionUserId,
      action: "NEWS_UPDATE_FAILED",
      entityType: "News",
      entityId: params.id,
      details: { error: error instanceof Error ? error.message : String(error), payload: requestBodyForLog },
      ipAddress,
      userAgent,
    });
    return NextResponse.json(
      { error: "Failed to update news" },
      { status: 500 }
    );
  }
}

// Excluir uma notícia específica (protegido, somente admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || null;
  const userAgent = request.headers.get("user-agent") || null;
  let sessionUserId: string | undefined = undefined;

  try {
    const session = await getServerSession(authOptions);
    sessionUserId = (session?.user as any)?.id;
    const userIsAdmin = (session?.user as any)?.isAdmin;

    if (!session || !userIsAdmin || !sessionUserId) {
      await logActivity({
        action: "NEWS_DELETE_ATTEMPT_UNAUTHORIZED",
        entityType: "News",
        entityId: params.id,
        ipAddress,
        userAgent,
      });
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      await logActivity({
        userId: sessionUserId,
        action: "NEWS_DELETE_NOT_FOUND",
        entityType: "News",
        entityId: id,
        ipAddress,
        userAgent,
      });
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }

    await prisma.news.delete({
      where: { id },
    });

    await logActivity({
      userId: sessionUserId,
      action: "NEWS_DELETE",
      entityType: "News",
      entityId: id,
      details: { title: existingNews.title },
      ipAddress,
      userAgent,
    });

    return NextResponse.json(
      { success: true, message: "News deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting news:", error);
    await logActivity({
      userId: sessionUserId,
      action: "NEWS_DELETE_FAILED",
      entityType: "News",
      entityId: params.id,
      details: { error: error instanceof Error ? error.message : String(error) },
      ipAddress,
      userAgent,
    });
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 }
    );
  }
} 