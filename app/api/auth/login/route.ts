import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDb } from "@/lib/config/db";
import User from '@/lib/models/UserModel';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  await connectDb();
  const user = await User.findOne({ username });
  if (!user) return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });

  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  
  const response = NextResponse.json({ message: 'Logged in successfully', username: user.username });
  response.cookies.set('token', token, { httpOnly: true });
  console.log(token)
  
  return response;
}
