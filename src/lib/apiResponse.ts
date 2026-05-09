import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function unauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbiddenResponse(message: string = 'Forbidden: Admin access required') {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function serverErrorResponse(error: any) {
  console.error('Server Error:', error);
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}

export function validationErrorResponse(error: ZodError) {
  const message = error.issues.map((issue: { message: string }) => issue.message).join(', ');
  return NextResponse.json({ error: `Validation failed: ${message}` }, { status: 400 });
}
