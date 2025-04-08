import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const url = req.nextUrl.clone();

  // if (!token) {
  //   if (!url.pathname.startsWith('/auth')) {
  //     url.pathname = '/auth/login';
  //     return NextResponse.redirect(url);
  //   }
  //   return NextResponse.next();
  // }

  if (token?.role === "admin" && !url.pathname.startsWith('/admin')) {
    url.pathname = '/admin/users';
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith('/admin') && token?.role !== 'admin') {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'], 
};
