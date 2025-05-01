// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    pathname === '/login' ||
    pathname === '/auth/callback' ||
    pathname === '/admin' ||
    pathname === '/admin/auth/callback' ||
    pathname === '/' ||
    /\.[^\/]+$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin/dashboard')) {
    const adminToken = req.cookies.get('ADMIN_TOKEN')?.value
    if (!adminToken) {
      const url = req.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  const accessToken = req.cookies.get('ACCESS_TOKEN')?.value
  if (!accessToken) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*']
}
