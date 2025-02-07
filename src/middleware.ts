import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const PUBLIC_ROUTES = ['/login', '/signup']; // Routes accessible without authentication

function isValidRedirectUrl(url:string) {
  return url && url.startsWith('/') && !url.includes('://');
}

export async function middleware(request:NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Get the access token from cookies
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('authToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  // If no access token, redirect to login
  if (!accessToken) {
    if( !refreshToken){

      const loginUrl = new URL('/login', request.url);
  
      if (isValidRedirectUrl(pathname)) {
        loginUrl.searchParams.set('redirect', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

  }

  // Verify the access token by calling the API
  try {
    console.log('test3:', accessToken);
    const verifyResponse = await fetch(new URL('/api/verify-token', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: accessToken }),
    });
    const { valid } = await verifyResponse.json();

    if (!valid) {
      throw new Error('Invalid token');
    }

    // If token is valid, continue to the requested page
    return NextResponse.next();
  } catch{

    // If access token is invalid, try refreshing it
    try {

      const refreshResponse = await fetch(new URL('/api/auth/refresh-token', request.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({refreshToken: refreshToken}),
      });

      const { accessToken: newAccessToken } = await refreshResponse.json();
console.log('test2:', newAccessToken);
      if (!newAccessToken) {
        console.log('test3');
        throw new Error('Failed to refresh access token');
      }

      // Set the new access token in the cookie
      cookieStore.set('authToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60, // 1 minute in seconds
        path: '/',
      });

      // Continue to the requested page
      return NextResponse.next();
    } catch (refreshError) {
      console.log('Refresh token failed:', refreshError);

      // If refresh token is invalid, redirect to login
      const loginUrl = new URL('/login', request.url);

      if (isValidRedirectUrl(pathname)) {
        loginUrl.searchParams.set('redirect', pathname);
      }

      return NextResponse.redirect(loginUrl);
    }
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};