import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { successResponse, errorResponse, serverErrorResponse, forbiddenResponse, unauthorizedResponse } from '@/lib/apiResponse';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const event = await prisma.event.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!event) {
      return errorResponse("Event not found", 404);
    }

    return successResponse(event);
  } catch (error) {
    return serverErrorResponse(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();
    if (user.role !== 'ADMIN') return forbiddenResponse();

    const resolvedParams = await params;
    // Delete related bookings first
    await prisma.booking.deleteMany({ where: { eventId: resolvedParams.id } });
    await prisma.event.delete({ where: { id: resolvedParams.id } });
    return successResponse({ message: "Event deleted successfully" });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
