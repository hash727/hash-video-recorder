import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { Key } from 'lucide-react';
import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000']

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
}

const isProtectedRoutes = createRouteMatcher([
    '/dashboard(.*)',
    '/api/payment',
    '/payment(.*)',
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const origin = req.headers.get('origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)

  const signInUrl = new URL('/auth/sign-in', req.nextUrl.origin);

  // Optional: add current page as redirect_url
  // signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname);

  // Handle preflight requests
    if(req.method === 'OPTIONS'){
      const preflightHeaders = {
        ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin}),
        ...corsOptions,
      }
      return NextResponse.json({}, {headers: preflightHeaders})
    }

    // Handle protected routes
    if (isProtectedRoutes(req)) {
        const sessionAuth = await auth();
        if (!sessionAuth.userId) {
            // Redirect unauthenticated users to sign-in
            // return Response.redirect('/auth/sign-in');
            return NextResponse.redirect(signInUrl);
        }
    }

    // Handle simple requests
    const response = NextResponse.next()

    if(isAllowedOrigin){
      response.headers.set('Access-Control-Allow-Origin', origin)
    }

    Object.entries(corsOptions).forEach(([Key, value]) => {
      response.headers.set(Key, value)
    })

    return response
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};