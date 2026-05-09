import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { createEventSchema } from '@/lib/validations/api';
import {
  successResponse, serverErrorResponse, validationErrorResponse,
  forbiddenResponse, unauthorizedResponse,
} from '@/lib/apiResponse';
import { Prisma } from '@prisma/client';

/* ─── Allowed sort fields ───────────────────────────────── */
const SORT_FIELDS = ['date', 'price', 'title', 'createdAt'] as const;
type SortField = typeof SORT_FIELDS[number];

const PAGE_SIZE = 9;

export async function GET(req: NextRequest) {
  try {
    const sp = new URL(req.url).searchParams;

    /* ── Parse & validate query params ───────────────────── */
    const q         = sp.get('q')?.trim()        ?? '';        // text search
    const type      = sp.get('type')             ?? '';        // UPCOMING | PAST | ''
    const location  = sp.get('location')?.trim() ?? '';
    const dateFrom  = sp.get('dateFrom')         ?? '';
    const dateTo    = sp.get('dateTo')           ?? '';
    const minPrice  = parseFloat(sp.get('minPrice') ?? '0');
    const maxPrice  = parseFloat(sp.get('maxPrice') ?? '999999');
    const rawSort   = sp.get('sort') ?? 'date';
    const order     = sp.get('order') === 'desc' ? 'desc' : 'asc';
    const page      = Math.max(1, parseInt(sp.get('page') ?? '1', 10));

    // Validate sort field to avoid injection
    const sort: SortField = SORT_FIELDS.includes(rawSort as SortField)
      ? (rawSort as SortField)
      : 'date';

    /* ── Build Prisma WHERE clause ────────────────────────── */
    const where: Prisma.EventWhereInput = {};

    // Type filter
    if (type === 'UPCOMING' || type === 'PAST') {
      where.type = type;
    }

    // Full-text search: title + description + location (case-insensitive)
    if (q) {
      where.OR = [
        { title:       { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { location:    { contains: q, mode: 'insensitive' } },
      ];
    }

    // Location filter (separate from search q)
    if (location && !q) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    // Date range
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo)   where.date.lte = new Date(dateTo);
    }

    // Price range
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      where.price = { gte: isNaN(minPrice) ? 0 : minPrice };
      if (!isNaN(maxPrice) && maxPrice < 999999) {
        (where.price as any).lte = maxPrice;
      }
    }

    /* ── Run count + paginated query in parallel ─────────── */
    const [total, events] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: { _count: { select: { bookings: true } } },
      }),
    ]);

    return successResponse({
      events,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / PAGE_SIZE),
        hasNext:  page < Math.ceil(total / PAGE_SIZE),
        hasPrev:  page > 1,
      },
    });
  } catch (error) {
    return serverErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return unauthorizedResponse();
    if (user.role !== 'ADMIN') return forbiddenResponse();

    const body   = await req.json();
    const result = createEventSchema.safeParse(body);
    if (!result.success) return validationErrorResponse(result.error);

    const { title, description, date, location, image, price, type, schedule } = result.data;

    const event = await prisma.event.create({
      data: {
        title, description,
        date: new Date(date),
        location,
        image: image || '/gallery/default.jpg',
        price, type,
        schedule: schedule || [],
      },
    });

    return successResponse(event, 201);
  } catch (error) {
    return serverErrorResponse(error);
  }
}
