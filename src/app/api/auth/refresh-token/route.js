import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
// import { cookies } from 'next/headers';

export async function POST(request) {
//   const cookieStore = await cookies();
  const {refreshToken} = await request.json();
console.log("refreshToken:",refreshToken);
  if (!refreshToken) {
    return NextResponse.json({ message: 'Refresh token is missing' }, { status: 400 });
  }

  try {
    // Verify refresh token (use a different secret key)
    const decoded = jwt.verify(refreshToken, '456'); // Using '456' as refresh token secret
    console.log('Decoded refresh token:', decoded);

    // Generate new access token
    const newAccessToken = jwt.sign({ email: decoded.email }, '123', {
      expiresIn: '1m', // 1-minute expiry
    });

    // // Update access token in cookies
    // cookieStore.set('accessToken', newAccessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   maxAge: 60, // 1 minute
    //   path: '/',
    // });

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (err) {
    console.log('Refresh token verification failed:', err);
    return NextResponse.json({ message: 'Invalid refresh token' }, { status: 403 });
  }
}
