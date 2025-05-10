import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // Proteger rotas do dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Se não estiver autenticado, redirecionar para a landing page
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Se estiver autenticado mas não for admin, redirecionar para a landing page
    if (token && !token.isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // Usuário autenticado tentando acessar a página de login
  if (request.nextUrl.pathname === '/paitrabalhou' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/paitrabalhou']
}; 