import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Дополнительная логика middleware
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Проверяем авторизацию для защищенных маршрутов
        const { pathname } = req.nextUrl
        
        // Публичные маршруты доступны всем
        if (pathname.startsWith('/auth') || pathname === '/' || pathname.startsWith('/api/auth')) {
          return true
        }
        
        // Все остальные маршруты требуют авторизации
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}