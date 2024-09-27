import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/config/db";
import User from "@/lib/models/UserModel";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  await connectDb();
  const existingUser = await User.findOne({ username });
  if (existingUser)
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });

  await newUser.save();
  return NextResponse.json({ message: "User registered successfully" });
}
