import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

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
    const session = await getToken({ req, secret: NEXTAUTH_SECRET })
    const adminCookie = req.cookies.get('ADMIN_TOKEN')?.value
    if (!session || !adminCookie) {
      const url = req.nextUrl.clone()
      url.pathname = '/admin'
      url.searchParams.set('next', pathname + search)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  const session = await getToken({ req, secret: NEXTAUTH_SECRET })
  if (!session) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname + search)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*']
}
