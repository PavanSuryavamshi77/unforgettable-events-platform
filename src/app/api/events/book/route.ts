import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';
import { randomUUID } from 'crypto';
import { getAuthUser } from '@/lib/auth';
import { bookEventSchema } from '@/lib/validations/api';
import { successResponse, errorResponse, serverErrorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/apiResponse';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return unauthorizedResponse('Please login to book an event');
    }

    const body = await req.json();
    const result = bookEventSchema.safeParse(body);
    
    if (!result.success) {
      return validationErrorResponse(result.error);
    }

    const { eventId } = result.data;
    const userId = user.id;

    // Verify user actually exists in DB
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return unauthorizedResponse('User session expired. Please log out and log in again.');
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return errorResponse('Event not found', 404);

    // Check duplicate booking
    const existing = await prisma.booking.findUnique({
      where: { userId_eventId: { userId, eventId } }
    });
    if (existing) {
      return NextResponse.json({ error: 'Already booked this event', ticketId: existing.ticketId }, { status: 409 });
    }

    const ticketId = `TKT-${randomUUID().slice(0, 8).toUpperCase()}`;
    const qrCodeDataUrl = await QRCode.toDataURL(ticketId, {
      color: { dark: '#778899', light: '#FFFFFF' },
      width: 300,
    });

    const booking = await prisma.booking.create({
      data: { userId, eventId, ticketId, qrCode: qrCodeDataUrl }
    });

    return successResponse(booking, 201);
  } catch (error: any) {
    return serverErrorResponse(error);
  }
}
