import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { scanTicketSchema } from '@/lib/validations/api';
import { successResponse, serverErrorResponse, validationErrorResponse, forbiddenResponse, unauthorizedResponse } from '@/lib/apiResponse';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();
    if (user.role !== 'ADMIN') return forbiddenResponse();

    const body = await req.json();
    const result = scanTicketSchema.safeParse(body);
    
    if (!result.success) {
      return validationErrorResponse(result.error);
    }

    const { ticketId } = result.data;

    const booking = await prisma.booking.findUnique({
      where: { ticketId },
      include: {
        event: true,
        user: true
      }
    });

    if (!booking) {
      return NextResponse.json({ valid: false, error: "Invalid Ticket. Not found." }, { status: 404 });
    }

    // You can add logic here to mark ticket as "used" if you had a `scannedAt` field.
    
    return successResponse({ 
      valid: true, 
      message: "Ticket is valid",
      ticket: {
        ticketId: booking.ticketId,
        userName: booking.user.name,
        eventName: booking.event.title,
        date: booking.event.date
      }
    });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
