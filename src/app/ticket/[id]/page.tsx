'use client';
import { useEffect, useState, use } from 'react';
import {
  Box, Typography, Container, Card, CardContent,
  Button, Chip, Divider, Alert, Skeleton,
} from '@mui/material';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, Calendar, MapPin, Clock, Ticket, User, Tag } from 'lucide-react';

export default function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res  = await fetch(`/api/ticket/${resolvedParams.id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setTicket(data);
      } catch {
        setError('Could not load ticket. Please check the ticket ID.');
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [resolvedParams.id]);

  const handleDownload = () => {
    if (!ticket?.qrCode) return;
    const a       = document.createElement('a');
    a.href        = ticket.qrCode;
    a.download    = `ticket-${ticket.ticketId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.5,
      borderBottom: '1px solid rgba(148,163,184,0.12)', '&:last-child': { borderBottom: 'none' } }}>
      <Box sx={{ color: 'text.disabled', mt: 0.15, flexShrink: 0 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.disabled" fontWeight={600} letterSpacing="0.05em" textTransform="uppercase" fontSize="0.68rem">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={600} color="primary.main">{value}</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ background: '#F8FAFC', minHeight: '100vh', pb: 10 }}>
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)',
        pt: { xs: 7, md: 9 }, pb: { xs: 7, md: 10 },
        textAlign: 'center', px: 3, position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 50% 70% at 50% 120%, rgba(245,158,11,0.22) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <Chip
            label="🎟️ Your Ticket"
            sx={{ mb: 2.5, background: 'rgba(245,158,11,0.18)', color: '#FCD34D',
              border: '1px solid rgba(245,158,11,0.3)', fontWeight: 700, fontSize: '0.78rem' }}
          />
          <Typography variant="h3" sx={{ color: '#FFFFFF', mb: 1 }}>
            {loading ? 'Loading…' : ticket?.event?.title ?? 'Ticket Details'}
          </Typography>
          {!loading && ticket && (
            <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem' }}>
              {new Date(ticket.event.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </Typography>
          )}
        </motion.div>
      </Box>

      <Container maxWidth="md" sx={{ mt: -4, position: 'relative', zIndex: 1 }}>

        {/* Back link */}
        <Button
          component={Link}
          href="/my-tickets"
          startIcon={<ArrowLeft size={16} />}
          sx={{
            mb: 3, color: 'text.secondary', fontWeight: 600,
            '&:hover': { color: 'primary.main', transform: 'none', boxShadow: 'none' },
          }}
        >
          Back to My Tickets
        </Button>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>
        )}

        {/* Loading skeletons */}
        {loading && (
          <Card sx={{ borderRadius: '24px', overflow: 'hidden' }}>
            <Box sx={{ height: 5 }} />
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Skeleton width={100} height={24} sx={{ mb: 2.5, borderRadius: 50 }} />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Box key={i} sx={{ py: 1.5, borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                      <Skeleton width="35%" height={14} sx={{ mb: 0.5 }} />
                      <Skeleton width="60%" height={20} />
                    </Box>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Skeleton variant="rounded" width={200} height={200} sx={{ borderRadius: 3 }} />
                  <Skeleton width={120} height={16} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Ticket card */}
        {!loading && !error && ticket && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card
              sx={{
                borderRadius: '24px', overflow: 'hidden',
                border: '1px solid rgba(245,158,11,0.2)',
                boxShadow: '0 20px 60px rgba(15,23,42,0.1)',
              }}
            >
              {/* Gold top bar */}
              <Box sx={{ height: 5, background: 'linear-gradient(90deg, #F59E0B, #FBBF24, #F59E0B)' }} />

              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 5 } }}>

                  {/* Left: Ticket info */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                      <Chip
                        label={ticket.event.type === 'UPCOMING' ? '✅ Valid Ticket' : '🏁 Past Event'}
                        sx={{
                          fontWeight: 700, fontSize: '0.78rem',
                          background: ticket.event.type === 'UPCOMING' ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)',
                          color: ticket.event.type === 'UPCOMING' ? 'success.main' : 'text.secondary',
                          border: `1px solid ${ticket.event.type === 'UPCOMING' ? 'rgba(16,185,129,0.3)' : 'rgba(148,163,184,0.3)'}`,
                        }}
                      />
                      {ticket.event.price > 0 && (
                        <Chip
                          label={`₹${ticket.event.price}`}
                          size="small"
                          sx={{ fontWeight: 800, background: 'rgba(245,158,11,0.1)', color: 'secondary.dark' }}
                        />
                      )}
                    </Box>

                    <InfoRow icon={<Ticket size={16} />}   label="Ticket ID"     value={ticket.ticketId} />
                    <InfoRow icon={<User size={16} />}      label="Attendee"      value={ticket.user.name} />
                    <InfoRow
                      icon={<Calendar size={16} />}
                      label="Event Date"
                      value={new Date(ticket.event.date).toLocaleDateString('en-IN', {
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    />
                    <InfoRow
                      icon={<Clock size={16} />}
                      label="Time"
                      value={new Date(ticket.event.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    />
                    <InfoRow icon={<MapPin size={16} />} label="Venue"         value={ticket.event.location} />
                    <InfoRow
                      icon={<Tag size={16} />}
                      label="Booked On"
                      value={new Date(ticket.createdAt).toLocaleString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    />

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1.5, mt: 3.5, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<Download size={16} />}
                        onClick={handleDownload}
                        sx={{ fontWeight: 700, px: 3, py: 1.2, borderRadius: 50 }}
                      >
                        Download QR
                      </Button>
                      <Button
                        component={Link}
                        href={`/events/${ticket.event.id}`}
                        variant="outlined"
                        sx={{
                          fontWeight: 600, px: 3, py: 1.2, borderRadius: 50,
                          borderColor: 'rgba(15,23,42,0.22)', color: 'primary.main',
                          '&:hover': { borderColor: 'primary.main', background: 'rgba(15,23,42,0.04)', transform: 'none', boxShadow: 'none' },
                        }}
                      >
                        Event Details
                      </Button>
                    </Box>
                  </Box>

                  {/* Dashed divider */}
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderStyle: 'dashed', borderColor: 'rgba(148,163,184,0.3)',
                      display: { xs: 'none', md: 'block' } }}
                  />

                  {/* Right: QR Code */}
                  <Box sx={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', gap: 2, minWidth: { md: 200 },
                  }}>
                    {ticket.qrCode ? (
                      <>
                        <Box sx={{
                          p: 2, borderRadius: 3,
                          background: '#FFFFFF',
                          border: '1px solid rgba(148,163,184,0.2)',
                          boxShadow: '0 4px 24px rgba(15,23,42,0.08)',
                        }}>
                          <img src={ticket.qrCode} alt="QR Code" style={{ width: 180, height: 180, display: 'block' }} />
                        </Box>
                        <Typography variant="caption" color="text.disabled" fontWeight={600} textAlign="center">
                          Show this QR at the venue entry
                        </Typography>
                      </>
                    ) : (
                      <Box sx={{
                        width: 180, height: 180, borderRadius: 3,
                        background: 'rgba(148,163,184,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px dashed rgba(148,163,184,0.3)',
                      }}>
                        <Typography variant="caption" color="text.disabled" textAlign="center" px={2}>
                          QR Code not available
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </Container>
    </Box>
  );
}
