import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/apiResponse';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse('Please login to view your tickets');

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            location: true,
            image: true,
            price: true,
            type: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(bookings);
  } catch (error) {
    return serverErrorResponse(error);
  }
}
