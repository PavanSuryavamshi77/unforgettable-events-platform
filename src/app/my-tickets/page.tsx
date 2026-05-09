'use client';
import { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Container, Grid, Card, CardContent, Button,
  Skeleton, Chip, Divider, Alert, Avatar, Tabs, Tab,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Calendar, MapPin, Ticket, Download, ExternalLink,
  QrCode, Clock, Tag, CheckCircle2, History,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

/* ── Types ──────────────────────────────────────────────── */
interface BookingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  price: number;
  type: 'UPCOMING' | 'PAST';
}

interface Booking {
  id: string;
  ticketId: string;
  qrCode: string | null;
  createdAt: string;
  event: BookingEvent;
}

/* ── Variants ───────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 0.97, transition: { duration: 0.2 } },
};

/* ── Skeleton ───────────────────────────────────────────── */
function TicketSkeleton() {
  return (
    <Card sx={{ overflow: 'hidden', borderRadius: '20px' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Skeleton variant="rectangular" sx={{ width: { xs: '100%', md: 200 }, height: { xs: 160, md: 'auto' }, minHeight: { md: 200 }, flexShrink: 0 }} />
        <CardContent sx={{ flex: 1, p: 3 }}>
          <Skeleton variant="rounded" width={80} height={22} sx={{ mb: 2, borderRadius: 50 }} />
          <Skeleton variant="text" width="65%" height={30} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="45%" height={20} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto', pt: 2 }}>
            <Skeleton variant="rounded" width={130} height={38} sx={{ borderRadius: 50 }} />
            <Skeleton variant="rounded" width={130} height={38} sx={{ borderRadius: 50 }} />
          </Box>
        </CardContent>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', px: 3, borderLeft: '1px dashed rgba(148,163,184,0.25)' }}>
          <Skeleton variant="rounded" width={110} height={110} sx={{ borderRadius: 2 }} />
        </Box>
      </Box>
    </Card>
  );
}

/* ── Empty State ────────────────────────────────────────── */
function EmptyState({ isUpcoming }: { isUpcoming: boolean }) {
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Box
        sx={{
          textAlign: 'center', py: 12, px: 4,
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(148,163,184,0.18)',
          borderRadius: '24px',
        }}
      >
        <Typography fontSize="4rem" mb={2}>{isUpcoming ? '🎟️' : '📚'}</Typography>
        <Typography variant="h5" fontWeight={700} color="primary.main" mb={1.5}>
          {isUpcoming ? 'No upcoming tickets' : 'No past events'}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4} maxWidth={380} mx="auto">
          {isUpcoming
            ? "You haven't booked any upcoming events yet. Explore what's on and grab your tickets!"
            : 'Your past event history will appear here once events you attended have concluded.'}
        </Typography>
        {isUpcoming && (
          <Button
            component={Link}
            href="/events"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ px: 5, py: 1.4, fontWeight: 700 }}
          >
            Explore Events
          </Button>
        )}
      </Box>
    </motion.div>
  );
}

/* ── Ticket Card ────────────────────────────────────────── */
function TicketCard({ booking }: { booking: Booking }) {
  const event    = booking.event;
  const isUpcoming = event.type === 'UPCOMING';
  const dateObj  = new Date(event.date);
  const bookedAt = new Date(booking.createdAt);

  const handleDownload = () => {
    if (!booking.qrCode) return;
    const a = document.createElement('a');
    a.href = booking.qrCode;
    a.download = `ticket-${booking.ticketId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <motion.div variants={cardVariants} layout>
      <Card
        sx={{
          overflow: 'hidden',
          background: isUpcoming
            ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,251,235,0.95) 100%)'
            : 'rgba(255,255,255,0.88)',
          border: isUpcoming
            ? '1px solid rgba(245,158,11,0.25)'
            : '1px solid rgba(148,163,184,0.15)',
          position: 'relative',
          '&:hover': { transform: 'translateY(-3px)' },
        }}
      >
        {/* Upcoming glow accent */}
        {isUpcoming && (
          <Box sx={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, #F59E0B, #FBBF24, #F59E0B)',
          }} />
        )}

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Event Image */}
          <Box
            sx={{
              width: { xs: '100%', md: 220 },
              minHeight: { xs: 170, md: 'auto' },
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden',
              background: '#E2E8F0',
            }}
          >
            <Box
              component="img"
              src={event.image || '/gallery/default.jpg'}
              alt={event.title}
              sx={{
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center',
                minHeight: { xs: 170, md: '100%' },
              }}
            />
            {/* Status overlay */}
            <Box sx={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'flex-end', p: 1.5,
              background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)',
            }}>
              <Chip
                label={isUpcoming ? '✅ Confirmed' : '🏁 Attended'}
                size="small"
                sx={{
                  fontSize: '0.7rem', fontWeight: 700,
                  background: isUpcoming ? 'rgba(16,185,129,0.9)' : 'rgba(100,116,139,0.85)',
                  color: '#fff',
                }}
              />
            </Box>
          </Box>

          {/* Main Content */}
          <CardContent sx={{ flex: 1, p: { xs: 2.5, md: 3 }, display: 'flex', flexDirection: 'column' }}>
            {/* Header row */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5, gap: 1 }}>
              <Box>
                <Typography variant="h6" fontWeight={800} color="primary.main" lineHeight={1.25} mb={0.5}>
                  {event.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7, color: 'text.secondary' }}>
                  <Ticket size={13} />
                  <Typography variant="caption" fontFamily="monospace" fontWeight={600} letterSpacing="0.05em">
                    {booking.ticketId}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={event.price ? `₹${event.price}` : 'FREE'}
                size="small"
                sx={{
                  fontWeight: 800, fontSize: '0.78rem', flexShrink: 0,
                  background: event.price ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)',
                  color: event.price ? 'secondary.dark' : 'success.main',
                  border: `1px solid ${event.price ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
                }}
              />
            </Box>

            {/* Meta */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.7, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <Calendar size={14} />
                <Typography variant="body2" fontWeight={500}>
                  {dateObj.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <Clock size={14} />
                <Typography variant="body2" fontWeight={500}>
                  {dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <MapPin size={14} />
                <Typography variant="body2" fontWeight={500}>{event.location}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.disabled' }}>
                <Tag size={13} />
                <Typography variant="caption">
                  Booked on {bookedAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Typography>
              </Box>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 'auto' }}>
              <Button
                component={Link}
                href={`/ticket/${booking.ticketId}`}
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<QrCode size={15} />}
                sx={{ fontWeight: 700, px: 2.5, borderRadius: 50 }}
              >
                View Ticket
              </Button>
              {booking.qrCode && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download size={15} />}
                  onClick={handleDownload}
                  sx={{
                    fontWeight: 600, px: 2.5, borderRadius: 50,
                    borderColor: 'rgba(15,23,42,0.22)', color: 'primary.main',
                    '&:hover': { borderColor: 'primary.main', background: 'rgba(15,23,42,0.04)', transform: 'none', boxShadow: 'none' },
                  }}
                >
                  Download QR
                </Button>
              )}
              <Button
                component={Link}
                href={`/events/${event.id}`}
                variant="text"
                size="small"
                endIcon={<ExternalLink size={13} />}
                sx={{
                  fontWeight: 600, color: 'text.secondary', ml: 'auto',
                  '&:hover': { transform: 'none', boxShadow: 'none', color: 'primary.main' },
                }}
              >
                Event Page
              </Button>
            </Box>
          </CardContent>

          {/* QR Panel — desktop only */}
          {booking.qrCode && (
            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' },
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                px: 3, minWidth: 160,
                borderLeft: '1px dashed rgba(148,163,184,0.3)',
                background: 'rgba(248,250,252,0.6)',
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  p: 1.5, borderRadius: 2.5, background: '#FFFFFF',
                  border: '1px solid rgba(148,163,184,0.2)',
                  boxShadow: '0 2px 12px rgba(15,23,42,0.08)',
                }}
              >
                <img
                  src={booking.qrCode}
                  alt="QR Code"
                  style={{ width: 100, height: 100, display: 'block' }}
                />
              </Box>
              <Typography variant="caption" color="text.disabled" fontWeight={600} textAlign="center">
                Scan at entry
              </Typography>
            </Box>
          )}
        </Box>
      </Card>
    </motion.div>
  );
}

/* ══════════════════════════════════ PAGE ══════════════════ */
export default function MyTicketsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [bookings, setBookings]   = useState<Booking[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [tab, setTab]             = useState(0);
  const router = useRouter();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/user/bookings', { credentials: 'include' });
      if (res.status === 401) { router.push('/login'); return; }
      if (!res.ok) throw new Error('Failed to load bookings');
      const data = await res.json();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) { router.push('/login'); return; }
      fetchBookings();
    }
  }, [authLoading, isAuthenticated, fetchBookings]);

  const upcoming = bookings.filter((b) => b.event.type === 'UPCOMING');
  const past     = bookings.filter((b) => b.event.type === 'PAST');
  const displayed = tab === 0 ? upcoming : past;

  return (
    <Box sx={{ background: '#F8FAFC', minHeight: '100vh', pb: 12 }}>

      {/* ── Page Header ─────────────────────────────────── */}
      <Box
        sx={{
          background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)',
          pt: { xs: 7, md: 10 }, pb: { xs: 8, md: 11 },
          textAlign: 'center', px: 3, position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Glow */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 60% at 50% 110%, rgba(245,158,11,0.22) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <Avatar
            sx={{
              width: 64, height: 64, mx: 'auto', mb: 2.5,
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              fontSize: '1.6rem', fontWeight: 800, color: '#0F172A',
              boxShadow: '0 4px 20px rgba(245,158,11,0.45)',
            }}
          >
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </Avatar>
          <Typography variant="h3" sx={{ color: '#FFFFFF', mb: 1 }}>
            My Tickets
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.55)', maxWidth: 420, mx: 'auto', fontSize: '1rem' }}>
            {user ? `Welcome back, ${user.name?.split(' ')[0] ?? ''}! ` : ''}
            All your event bookings in one place.
          </Typography>

          {/* Stats chips */}
          {!loading && !error && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3.5, flexWrap: 'wrap' }}>
              {[
                { icon: <CheckCircle2 size={14} />, label: `${upcoming.length} Upcoming`,  color: '#10B981' },
                { icon: <History size={14} />,       label: `${past.length} Past`,         color: '#94A3B8' },
                { icon: <Ticket size={14} />,         label: `${bookings.length} Total`,   color: '#F59E0B' },
              ].map((s) => (
                <Chip
                  key={s.label}
                  icon={<Box sx={{ color: s.color, display: 'flex', pl: 0.5 }}>{s.icon}</Box>}
                  label={s.label}
                  sx={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#FFFFFF', fontWeight: 700, fontSize: '0.8rem',
                    backdropFilter: 'blur(8px)',
                  }}
                />
              ))}
            </Box>
          )}
        </motion.div>
      </Box>

      {/* ── Content ─────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 1 }}>

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            action={<Button size="small" onClick={fetchBookings}>Retry</Button>}
            sx={{ mb: 4, borderRadius: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* Tab switcher */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
          <Box sx={{
            background: '#FFFFFF', borderRadius: 50, p: 0.6,
            border: '1px solid rgba(148,163,184,0.2)',
            boxShadow: '0 2px 12px rgba(15,23,42,0.06)',
            display: 'flex',
          }}>
            {[
              { label: 'Upcoming', count: upcoming.length },
              { label: 'Past',     count: past.length },
            ].map((t, i) => (
              <Button
                key={t.label}
                onClick={() => setTab(i)}
                sx={{
                  px: 3, py: 0.9, borderRadius: 50, fontWeight: 600, fontSize: '0.88rem',
                  transition: 'all 0.25s ease',
                  background: tab === i ? 'linear-gradient(135deg,#F59E0B,#FBBF24)' : 'transparent',
                  color: tab === i ? '#0F172A' : 'text.secondary',
                  boxShadow: tab === i ? '0 2px 12px rgba(245,158,11,0.35)' : 'none',
                  '&:hover': { transform: 'none', boxShadow: tab === i ? '0 2px 12px rgba(245,158,11,0.35)' : 'none' },
                  gap: 0.8,
                }}
              >
                {t.label}
                {!loading && (
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 20, height: 20, borderRadius: '50%', fontSize: '0.7rem', fontWeight: 800,
                      background: tab === i ? 'rgba(15,23,42,0.15)' : 'rgba(100,116,139,0.12)',
                      color: tab === i ? '#0F172A' : 'text.secondary',
                    }}
                  >
                    {t.count}
                  </Box>
                )}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Cards */}
        <AnimatePresence mode="popLayout">
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <TicketSkeleton key={i} />
              ))}
            </Box>
          ) : displayed.length === 0 ? (
            <EmptyState key={`empty-${tab}`} isUpcoming={tab === 0} />
          ) : (
            <motion.div
              key={`list-${tab}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {displayed.map((booking) => (
                  <TicketCard key={booking.id} booking={booking} />
                ))}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}
