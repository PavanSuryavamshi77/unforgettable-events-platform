import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await verifyAuthToken(token);

    if (!user) {
      // Token is invalid or expired
      const response = NextResponse.json({ user: null }, { status: 401 });
      response.cookies.delete('auth-token');
      return response;
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session verify error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
