import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Tickets',
  description: 'View all your booked event tickets with QR codes. Download and manage your Unforgettable Events bookings.',
  robots: { index: false, follow: false }, // private page — no indexing
};

export default function MyTicketsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
