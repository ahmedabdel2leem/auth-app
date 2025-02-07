import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// In-memory storage for users (replace with a database in production)
const users = [
  {
    email: 'user@example.com',
    password: '$2b$10$f7nVcO5VTzulmhybkZ0xg.jxNXlRHsRawlzKHxU8w2KYBUSUgnV8S'  
  }
];

export async function POST(request) {
  const { email, password } = await request.json();

  // Check if user already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    console.log(existingUser);
    return NextResponse.json({ message: 'User already exists' }, { status: 400 });
  }
console.log("email:",email,"password:",password);
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
console.log("hashedPassword:",hashedPassword);
  // Create user
  const user = { email, password: hashedPassword };
  users.push(user);

  console.log("users:",users);
  return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
}
console.log("users:",users);