import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Events',
  description:
    'Search and filter upcoming and past cultural events in India — Navratri, Holi, concerts, and more. Book your tickets instantly.',
  openGraph: {
    title: 'Browse Events | Unforgettable Events',
    description: 'Find and book cultural festivals, concerts, and celebrations near you.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
