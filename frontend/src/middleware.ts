import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('ADMIN_TOKEN')?.value
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin/dashboard')) {
    if (!token) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/admin'
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/dashboard',
    '/admin/dashboard/:path*'
  ]
}