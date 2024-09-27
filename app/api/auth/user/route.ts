import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDb } from "@/lib/config/db";
import User from "@/lib/models/UserModel";

export async function GET(req: Request) {
  // Extract the token from the cookie
  const cookie = req.headers.get('cookie');
  const token = cookie?.split('token=')[1]?.split(';')[0];

  if (!token) {
    return NextResponse.json({ message: 'No token found' }, { status: 401 });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    await connectDb();
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ username: user.username,id: user._id});
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
  }
}
