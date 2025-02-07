import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request) {
  const { token } = await request.json();
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value; // Get refresh token from cookies

  if (!token) {
    return NextResponse.json({ message: 'Token is required' }, { status: 400 });
  }

  try {
    // Verify the provided access token
    const decoded = jwt.verify(token, '123'); // Use your access token secret
    console.log('Decoded token:', decoded);

    return NextResponse.json({ valid: true });
  } catch (err) {
    console.log('Token verification failed:', err);

    // If token expired and a refresh token exists, try refreshing
    if (err.name === 'TokenExpiredError' && refreshToken) {
      try {
        // Verify the refresh token
        const decodedRefresh = jwt.verify(refreshToken, '456'); // Use refresh token secret
        console.log('Decoded refresh token:', decodedRefresh);

        // Generate a new access token
        const newAccessToken = jwt.sign({ email: decodedRefresh.email }, '123', {
          expiresIn: '1m', // 1-minute expiry
        });

        // Update access token in cookies
        cookieStore.set('authToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60, // 1 minute
          path: '/',
        });

        return NextResponse.json({ valid: true, accessToken:newAccessToken });
      } catch (refreshError) {
        console.log('Refresh token verification failed:', refreshError);
        return NextResponse.json({ valid: false, message: 'Refresh token invalid' });
      }
    }

    return NextResponse.json({ valid: false, message: 'Invalid token' });
  }
}
