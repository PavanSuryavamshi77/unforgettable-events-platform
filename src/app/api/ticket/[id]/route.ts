import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/apiResponse';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const booking = await prisma.booking.findUnique({
      where: { ticketId: resolvedParams.id },
      include: {
        event: true,
        user: true
      }
    });

    if (!booking) {
      return errorResponse("Ticket not found", 404);
    }

    return successResponse(booking);
  } catch (error) {
    return serverErrorResponse(error);
  }
}
