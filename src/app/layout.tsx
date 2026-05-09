import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import Navbar from "@/components/Navbar/Navbar";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import "./globals.css";

/* ── Fonts — display:swap prevents FOUT blocking render ── */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // only used for ticket IDs — no preload needed
});

/* ── Root metadata ──────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Unforgettable Events — Book Cultural Festivals & Concerts",
    template: "%s | Unforgettable Events",
  },
  description:
    "Discover and book the best cultural events in India — Navratri Garba, Holi celebrations, live concerts, and more. Secure booking with instant QR tickets.",
  keywords: [
    "events", "navratri", "garba", "holi", "concerts", "indian festivals",
    "event booking", "tickets", "cultural events",
  ],
  authors: [{ name: "Unforgettable Events" }],
  creator: "Unforgettable Events",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Unforgettable Events",
    title: "Unforgettable Events — Book Cultural Festivals & Concerts",
    description:
      "Discover and book the best cultural events in India. Secure booking with instant QR tickets.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Unforgettable Events Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unforgettable Events",
    description: "Book cultural festivals and concerts. Instant QR tickets.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    // google: "your-google-verification-code", // add when deploying
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F172A",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://db.pysyrzdjymjilybankpq.supabase.co" />
      </head>
      <body suppressHydrationWarning>
        <ThemeRegistry>
          <AuthProvider>
            <Navbar />
            <ErrorBoundary>
              <main style={{ minHeight: "80vh" }}>{children}</main>
            </ErrorBoundary>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
