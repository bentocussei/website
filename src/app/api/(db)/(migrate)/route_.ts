// import { NextResponse } from "next/server";
// import { exec } from "child_process";
// import { promisify } from "util";

// const execPromise = promisify(exec);

// // IMPORTANTE: Esta rota deve ser protegida ou removida em produção
// export async function POST(request: Request) {
//   // Verificar se estamos em ambiente de desenvolvimento
//   if (process.env.NODE_ENV === "production") {
//     return NextResponse.json(
//       { error: "This route is not available in production" },
//       { status: 403 }
//     );
//   }

//   try {
//     const data = await request.json();
//     const { secretKey } = data;

//     // Chave secreta para executar as migrações
//     const expectedSecretKey = process.env.MIGRATE_SECRET_KEY || "desenvolvimento-migrate-secreto";
    
//     if (secretKey !== expectedSecretKey) {
//       return NextResponse.json(
//         { error: "Invalid secret key" },
//         { status: 401 }
//       );
//     }

//     // Executar o comando de migração do Prisma
//     // Este comando irá criar as tabelas no banco de dados
//     const { stdout, stderr } = await execPromise("npx prisma db push");

//     if (stderr && !stderr.includes("Everything is up to date")) {
//       throw new Error(stderr);
//     }

//     return NextResponse.json(
//       { 
//         success: true, 
//         message: "Database migration completed successfully",
//         details: stdout
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error running database migration:", error);
//     return NextResponse.json(
//       { error: "Failed to run database migration", details: String(error) },
//       { status: 500 }
//     );
//   }
// } 