import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get('token')?.value
  const userCookie = request.cookies.get('user')?.value

  let user = null
  try {
    if (userCookie) {
      user = JSON.parse(decodeURIComponent(userCookie))
    }
  } catch (e) {
    user = null
  }

  const isLoggedIn = !!token && !!user

  const authRoutes = ['/login', '/signup', '/verify-otp']
  const isAuthRoute = authRoutes.includes(pathname)

  const isDashboardRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/client') ||
    pathname.startsWith('/technician')

  if (isAuthRoute) {
    if (isLoggedIn && user?.role) {
      return NextResponse.redirect(
        new URL(`/${user.role.toLowerCase()}`, request.url)
      )
    }
    return NextResponse.next()
  }

  if (isDashboardRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const role = user?.role?.toLowerCase()
    const currentRoute = pathname.split('/')[1]

    if (role && currentRoute !== role) {
      return NextResponse.redirect(new URL(`/${role}`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/verify-otp',
    '/admin/:path*',
    '/client/:path*',
    '/technician/:path*',
  ],
}