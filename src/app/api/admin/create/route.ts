import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ATENÇÃO: Esta rota deve ser removida em produção
// e usada apenas para criar o primeiro usuário administrador
export async function POST(request: Request) {
  // Verificar se estamos em ambiente de desenvolvimento
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This route is not available in production" },
      { status: 403 }
    );
  }

  try {
    const data = await request.json();
    const { name, email, password, secretKey } = data;

    // Validação básica
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Verificar se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o usuário administrador
    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin: true,
      },
    });

    // Remover a senha da resposta
    const { password: _, ...adminWithoutPassword } = newAdmin;

    return NextResponse.json(
      { 
        success: true, 
        message: "Admin user created successfully",
        user: adminWithoutPassword
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    );
  }
} 