import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const users = [
  {
    email: 'user@example.com',
    password: '$2b$10$f7nVcO5VTzulmhybkZ0xg.jxNXlRHsRawlzKHxU8w2KYBUSUgnV8S',
  },
];

export async function POST(request) {
  const { email, password } = await request.json();

  // Find user
  const user = users.find((user) => user.email === email);
  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
  }

  // Generate access & refresh tokens
  const accessToken = jwt.sign({ email: user.email }, '123', { expiresIn: '1m' }); // 1-minute expiry
  const refreshToken = jwt.sign({ email: user.email }, '456', { expiresIn: '7d' }); // 7-day expiry

  // Set cookies
  const cookieStore = await cookies();
  cookieStore.set('authToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60, // 1 minute
    path: '/',
  });

  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 604800, // 7 days
    path: '/',
  });

  return NextResponse.json({ message: 'Logged in successfully' });
}
