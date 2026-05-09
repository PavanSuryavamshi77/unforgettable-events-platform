import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/validations/api';
import { successResponse, errorResponse, serverErrorResponse, validationErrorResponse } from '@/lib/apiResponse';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);
    
    if (!result.success) {
      return validationErrorResponse(result.error);
    }

    const { name, email, password } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return errorResponse('Email already registered', 409);
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email: normalizedEmail, password: hashed, role: 'USER' },
    });

    return successResponse({ id: user.id, name: user.name, email: user.email }, 201);
  } catch (error) {
    return serverErrorResponse(error);
  }
}
