import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDb } from "@/lib/config/db";
import User from '@/lib/models/UserModel';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Basic input validation
    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    // Connect to the database
    await connectDb();

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      // Generic error to prevent user enumeration
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    // Set the token in HttpOnly cookie
    const response = NextResponse.json({ message: 'Logged in successfully', username: user.username });
    response.cookies.set('token', token, { httpOnly: true });

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
