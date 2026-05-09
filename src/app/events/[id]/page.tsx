'use client';
import { useEffect, useState, use } from 'react';
import {
  Box, Typography, Container, Grid, Card, CardContent,
  Button, Divider, Skeleton, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, InputLabel, FormControl, TextField, Chip,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, CreditCard, Banknote, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isAuthenticated, isLoading } = useAuthStore();

  const [event,          setEvent]          = useState<any>(null);
  const [loading,        setLoading]        = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error,          setError]          = useState('');
  const [success,        setSuccess]        = useState('');
  const [paymentModal,   setPaymentModal]   = useState(false);
  const [paymentMethod,  setPaymentMethod]  = useState('UPI');
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setEvent)
      .catch(() => setError('Could not load event details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleOpenCheckout = () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    setPaymentModal(true);
  };

  const handleBookEvent = async () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    setBookingLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 1200)); // simulate processing
    try {
      const res  = await fetch('/api/events/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ eventId: event.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409 && data.ticketId) { router.push(`/ticket/${data.ticketId}`); return; }
        throw new Error(data.error || 'Booking failed');
      }
      setSuccess('Payment successful! Redirecting to your ticket…');
      setPaymentModal(false);
      setTimeout(() => router.push(`/ticket/${data.ticketId}`), 1500);
    } catch (err: any) {
      setError(err.message);
      setPaymentModal(false);
    } finally {
      setBookingLoading(false);
    }
  };

  /* ── Skeleton ──────────────────────────────────────────── */
  if (loading) return (
    <Box sx={{ background: '#F8FAFC', minHeight: '100vh', pb: 10 }}>
      <Box sx={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)', height: { xs: 160, md: 200 } }} />
      <Container maxWidth="lg" sx={{ mt: -4 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 4 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton width="80%" height={44} sx={{ mb: 2 }} />
            <Skeleton width="60%" height={24} sx={{ mb: 1.5 }} />
            <Skeleton width="50%" height={24} sx={{ mb: 3 }} />
            <Skeleton width="40%" height={40} sx={{ mb: 3 }} />
            <Skeleton variant="text" height={18} />
            <Skeleton variant="text" height={18} />
            <Skeleton variant="text" width="75%" height={18} sx={{ mb: 4 }} />
            <Skeleton variant="rounded" height={52} sx={{ borderRadius: 50 }} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  if (error && !event) return (
    <Container sx={{ py: 10 }}>
      <Alert severity="error" sx={{ borderRadius: 3 }}>
        {error} — <Link href="/events" style={{ fontWeight: 700 }}>Browse all events</Link>
      </Alert>
    </Container>
  );

  const dateObj     = new Date(event.date);
  const isUpcoming  = event.type === 'UPCOMING';

  return (
    <Box sx={{ background: '#F8FAFC', minHeight: '100vh', pb: 10 }}>
      {/* ── Dark header strip ─────────────────────────────── */}
      <Box sx={{
        background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)',
        pt: { xs: 5, md: 7 }, pb: { xs: 6, md: 8 }, px: 3,
        position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 60% at 50% 120%, rgba(245,158,11,0.2) 0%, transparent 65%)',
          pointerEvents: 'none' }} />
      </Box>

      <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 1 }}>
        {/* Back link */}
        <Button component={Link} href="/events" startIcon={<ArrowLeft size={16} />}
          sx={{ mb: 3, color: 'text.secondary', fontWeight: 600,
            '&:hover': { color: 'primary.main', transform: 'none', boxShadow: 'none' } }}>
          All Events
        </Button>

        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* ── Event Image ────────────────────────────────── */}
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 60px rgba(15,23,42,0.15)' }}>
                <Box sx={{ position: 'relative', width: '100%', height: 400 }}>
                  <Image
                    src={event.image || '/gallery/default.jpg'}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                  <Chip
                    label={isUpcoming ? '✅ Upcoming' : '🏁 Past Event'}
                    sx={{
                      position: 'absolute', bottom: 16, left: 16, fontWeight: 700, fontSize: '0.78rem',
                      background: isUpcoming ? 'rgba(16,185,129,0.9)' : 'rgba(100,116,139,0.85)', color: '#fff',
                      backdropFilter: 'blur(6px)',
                    }}
                  />
                </Box>
              </Card>
            </motion.div>
          </Grid>

          {/* ── Event Details ──────────────────────────────── */}
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>

              <Typography variant="h3" fontWeight={800} color="primary.main" mb={2.5} lineHeight={1.2}>
                {event.title}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 3 }}>
                {[
                  { icon: <Calendar size={18} />, text: dateObj.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
                  { icon: <Clock size={18} />,    text: dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
                  { icon: <MapPin size={18} />,   text: event.location },
                ].map((row) => (
                  <Box key={row.text} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: 'text.secondary' }}>
                    {row.icon}
                    <Typography variant="body1" fontWeight={500}>{row.text}</Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 3 }}>
                <Banknote size={24} color="#D97706" />
                <Typography variant="h4" fontWeight={800} color="secondary.dark">
                  {event.price ? `₹${event.price}` : 'FREE'}
                </Typography>
              </Box>

              <Typography variant="body1" color="text.secondary" lineHeight={1.75} mb={4}>
                {event.description}
              </Typography>

              {error   && <Alert severity="error"   sx={{ mb: 2, borderRadius: 2.5 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2.5 }}>{success}</Alert>}

              {isUpcoming && (
                isLoading ? (
                  // Auth still initializing — show placeholder to avoid layout shift
                  <Box sx={{ height: 60, borderRadius: 3, background: 'rgba(148,163,184,0.12)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                ) : isAuthenticated ? (
                  <Button variant="contained" color="secondary" size="large" fullWidth
                    onClick={handleOpenCheckout} disabled={bookingLoading}
                    sx={{ py: 1.8, fontSize: '1.1rem', fontWeight: 800 }}>
                    🎟️ Book Now{event.price ? ` — ₹${event.price}` : ' — FREE'}
                  </Button>
                ) : (
                  <>
                    <Button
                      component={Link}
                      href={`/login?redirect=/events/${event.id}`}
                      variant="contained"
                      color="secondary"
                      size="large"
                      fullWidth
                      sx={{ py: 1.8, fontSize: '1.05rem', fontWeight: 800 }}
                    >
                      🔐 Login to Book Tickets
                    </Button>
                    <Typography variant="caption" color="text.disabled" textAlign="center" display="block" mt={1}>
                      You need an account to book this event.
                      <Link href="/register" style={{ color: '#F59E0B', fontWeight: 700, marginLeft: 4 }}>Register free →</Link>
                    </Typography>
                  </>
                )
              )}
            </motion.div>
          </Grid>
        </Grid>

        {/* ── Schedule ──────────────────────────────────────── */}
        {Array.isArray(event.schedule) && event.schedule.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <Box sx={{ mt: 10 }}>
              <Typography variant="h4" fontWeight={800} color="primary.main" mb={1}>Event Schedule</Typography>
              <Divider sx={{ mb: 4, borderColor: 'rgba(148,163,184,0.25)' }} />
              <Grid container spacing={2.5}>
                {event.schedule.map((item: any, i: number) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Card sx={{ borderLeft: '4px solid #F59E0B', borderRadius: 3 }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8, color: 'secondary.dark' }}>
                          <Clock size={16} />
                          <Typography variant="h6" fontWeight={700}>{item.time}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">{item.activity}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>
        )}
      </Container>

      {/* ── Payment Modal ──────────────────────────────────── */}
      <Dialog open={paymentModal} onClose={() => !bookingLoading && setPaymentModal(false)}
        fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4, p: 0.5 } }}>
        <DialogTitle sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1.2, pb: 1 }}>
          <CreditCard size={22} color="#F59E0B" /> Complete Booking
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" fontSize="0.68rem">Event</Typography>
            <Typography variant="h6" fontWeight={700}>{event?.title}</Typography>
          </Box>
          <Box sx={{ mb: 4, p: 2.5, borderRadius: 3, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography fontWeight={600}>Total Amount</Typography>
            <Typography variant="h5" fontWeight={900} color="secondary.dark">
              {event?.price ? `₹${event.price}` : 'FREE'}
            </Typography>
          </Box>
          <FormControl fullWidth sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}>
            <InputLabel>Payment Method</InputLabel>
            <Select value={paymentMethod} label="Payment Method" onChange={(e) => setPaymentMethod(e.target.value)}>
              <MenuItem value="UPI">UPI (Google Pay / PhonePe)</MenuItem>
              <MenuItem value="CREDIT_CARD">Credit / Debit Card</MenuItem>
              <MenuItem value="NET_BANKING">Net Banking</MenuItem>
            </Select>
          </FormControl>
          {paymentMethod === 'UPI' && (
            <TextField fullWidth label="UPI ID" placeholder="user@okicici" variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
          )}
          {paymentMethod === 'CREDIT_CARD' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField fullWidth label="Card Number" placeholder="xxxx xxxx xxxx xxxx"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField fullWidth label="Expiry" placeholder="MM/YY" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
                <TextField fullWidth label="CVV" type="password" placeholder="•••" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
              </Box>
            </Box>
          )}
          {paymentMethod === 'NET_BANKING' && (
            <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}>
              <InputLabel>Select Bank</InputLabel>
              <Select label="Select Bank" defaultValue="SBI">
                <MenuItem value="SBI">State Bank of India</MenuItem>
                <MenuItem value="HDFC">HDFC Bank</MenuItem>
                <MenuItem value="ICICI">ICICI Bank</MenuItem>
                <MenuItem value="AXIS">Axis Bank</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={() => setPaymentModal(false)} disabled={bookingLoading}
            sx={{ color: 'text.secondary', '&:hover': { transform: 'none', boxShadow: 'none' } }}>
            Cancel
          </Button>
          <Button onClick={handleBookEvent} variant="contained" color="secondary"
            disabled={bookingLoading} sx={{ fontWeight: 800, px: 4 }}>
            {bookingLoading ? 'Processing…' : `Confirm${event?.price ? ` ₹${event.price}` : ' — FREE'}`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
