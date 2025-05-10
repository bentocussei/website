import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { logActivity } from "@/lib/activityLogger";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || null;
  const userAgent = request.headers.get("user-agent") || null;

  try {
    const data = await request.json();
    const { name, email, subject, message } = data;

    // Validação básica
    if (!name || !email || !message) {
      await logActivity({
        action: "CONTACT_MESSAGE_VALIDATION_FAILED",
        details: { error: "Name, email, and message are required fields.", payload: data },
        ipAddress,
        userAgent,
      });
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

    await logActivity({
      action: "CONTACT_MESSAGE_CREATE_SUCCESS",
      entityType: "ContactMessage",
      entityId: newContactMessage.id,
      details: { name, email, subject: newContactMessage.subject },
      ipAddress,
      userAgent,
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
    const dataForLogError = await request.json().catch(() => ({}));
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    await logActivity({
      action: "CONTACT_MESSAGE_CREATE_FAILED",
      details: { error: errorMessage, payload: dataForLogError },
      ipAddress,
      userAgent,
    });
    return NextResponse.json(
      { error: "Failed to send message. Please try again later.", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || null;
  const userAgent = request.headers.get("user-agent") || null;

  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.isAdmin) {
    await logActivity({
      action: "CONTACT_MESSAGE_VIEW_UNAUTHORIZED",
      ipAddress,
      userAgent,
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        timestamp: "desc",
      },
    });

    await logActivity({
      userId: (session?.user as any)?.id,
      action: "CONTACT_MESSAGE_VIEW_SUCCESS",
      details: { count: messages.length },
      ipAddress,
      userAgent,
    });
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    await logActivity({
      userId: (session?.user as any)?.id,
      action: "CONTACT_MESSAGE_VIEW_FAILED",
      details: { error: errorMessage },
      ipAddress,
      userAgent,
    });
    return NextResponse.json(
      { error: "Failed to fetch messages.", details: errorMessage },
      { status: 500 }
    );
  }
} 