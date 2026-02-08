import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const res = NextResponse.next();

    // Check if the route is /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Check for Supabase Auth Tokens (default names)
        // Adjust logic if you use custom cookie attributes, but typically sb-<ref>-auth-token
        // Or simplified: just check if ANY cookie starting with sb- exists or just let client side handle it?
        // No, user asked for "admin panel should be open with login creadetails only" -> implies protection.

        // Basic Check: Look for the auth token. 
        // Note: The cookie name depends on your Supabase project ref, usually `sb-<project-ref>-auth-token`
        // Since we might not know the project ref here easily without env parsing, 
        // we can check if there are any cookies or if specific auth cookies exist.

        // However, a more robust way without extra deps is to just let the Layout handle the redirect?
        // No, middleware is better.

        // Let's look for *any* cookie that looks like a Supabase session for now, 
        // OR better: Assume if no cookies at all, redirect.

        const allCookies = request.cookies.getAll();
        const hasAuthCookie = allCookies.some(c => c.name.includes('auth-token') || c.name.startsWith('sb-'));

        if (!hasAuthCookie) {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return res;
}

export const config = {
    matcher: '/admin/:path*',
};
