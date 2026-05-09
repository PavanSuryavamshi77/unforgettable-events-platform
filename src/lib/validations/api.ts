import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createEventSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(5, "Description is required"),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date" }),
  location: z.string().min(3, "Location is required"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  price: z.union([z.string(), z.number()]).optional().transform(v => Number(v) || 0),
  type: z.enum(['UPCOMING', 'PAST']).optional().default('UPCOMING'),
  schedule: z.any().optional(), // Can refine this later if needed
});

export const bookEventSchema = z.object({
  eventId: z.string().uuid("Invalid event ID"),
  // Note: userId is no longer accepted from client payload for security
});

export const scanTicketSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),
});
