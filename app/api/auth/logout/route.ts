import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.delete('token'); // Clear the token cookie on logout
  return response;
}
