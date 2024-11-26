import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames and exclude static assets
  matcher: [
    // Include internationalized routes
    '/',
    '/(ja|en)/:path*',
    
    // Exclude static files and api routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|webp|js|css|woff|woff2)).*)',
  ]
};