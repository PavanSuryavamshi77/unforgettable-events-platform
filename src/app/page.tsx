'use client';
import { Box, Typography, Button, Container, Grid, Card, CardContent, Chip } from '@mui/material';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Star, Zap, Users } from 'lucide-react';

/* ── Animation variants ─────────────────────────────────── */
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardHover: Variants = {
  rest:  { y: 0,  scale: 1 },
  hover: { y: -6, scale: 1.02, transition: { duration: 0.3, ease: 'easeOut' } },
};

/* ── Data ───────────────────────────────────────────────── */
const features = [
  { icon: <Zap size={22} />,   label: 'Instant Booking',   desc: 'Reserve your spot in seconds with our seamless checkout flow.' },
  { icon: <Star size={22} />,  label: 'Premium Events',    desc: 'Curated experiences — Garba, Holi, concerts, and more.' },
  { icon: <Users size={22} />, label: 'Community',         desc: 'Join thousands celebrating culture and vibrant festivals.' },
];

const featuredCards = [
  {
    image:    '/gallery/dandiya2.jpg',
    title:    'Navratri Garba Nights',
    tag:      'Festival',
    tagColor: '#F59E0B',
    desc:     'Live music, professional DJs, and authentic Dandiya — the biggest night of the season.',
  },
  {
    image:    '/gallery/past2.jpg',
    title:    'Holi Celebrations',
    tag:      'Cultural',
    tagColor: '#10B981',
    desc:     'Organic colors, rain dances, and spectacular cultural performances under the open sky.',
  },
  {
    image:    '/gallery/past1.jpg',
    title:    'Live Concerts',
    tag:      'Music',
    tagColor: '#8B5CF6',
    desc:     'World-class artists, spectacular light shows, and unforgettable memories every time.',
  },
];

export default function Home() {
  return (
    <Box>
      {/* ════════════════════════════════════════ HERO ════ */}
      <Box
        className="gradient-mesh"
        sx={{
          minHeight: { xs: '88vh', md: '90vh' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: { xs: 3, md: 6 },
          pb: 8,
          pt: { xs: 8, md: 4 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blurs */}
        <Box sx={{
          position: 'absolute', top: '10%', left: '5%', width: 420, height: 420,
          borderRadius: '50%', background: 'rgba(245,158,11,0.15)', filter: 'blur(80px)', pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', bottom: '5%', right: '5%', width: 320, height: 320,
          borderRadius: '50%', background: 'rgba(139,92,246,0.12)', filter: 'blur(70px)', pointerEvents: 'none',
        }} />

        {/* Badge */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <Chip
            label="✨ India's Premier Event Platform"
            sx={{
              mb: 4, px: 2, py: 0.5, fontSize: '0.8rem', fontWeight: 600,
              background: 'rgba(245,158,11,0.18)',
              color: '#FCD34D',
              border: '1px solid rgba(245,158,11,0.3)',
              backdropFilter: 'blur(8px)',
            }}
          />
        </motion.div>

        {/* Headline */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '2.6rem', sm: '3.5rem', md: '5rem' },
              color: '#FFFFFF',
              lineHeight: 1.1,
              mb: 3,
              maxWidth: 820,
              mx: 'auto',
            }}
          >
            Create{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 50%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Unforgettable
            </Box>{' '}
            Memories
          </Typography>
        </motion.div>

        {/* Sub-headline */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2}>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255,255,255,0.72)', mb: 5, maxWidth: 560, mx: 'auto',
              fontWeight: 400, fontSize: { xs: '1.05rem', md: '1.2rem' },
            }}
          >
            Experience the joy of Navratri, Holi, vibrant concerts, and cultural festivals — all in one place.
          </Typography>
        </motion.div>

        {/* CTAs */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.3}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={Link}
              href="/events"
              endIcon={<ArrowRight size={18} />}
              sx={{ px: 4, py: 1.6, fontSize: '1rem' }}
            >
              Explore Events
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              href="/register"
              sx={{
                px: 4, py: 1.6, fontSize: '1rem',
                borderColor: 'rgba(255,255,255,0.35)',
                color: '#FFFFFF',
                '&:hover': { borderColor: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.08)' },
              }}
            >
              Create Account
            </Button>
          </Box>
        </motion.div>

        {/* Stats row */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.45}
          style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}
        >
          <Box
            sx={{
              mt: 7, display: 'flex', justifyContent: 'center', gap: { xs: 4, md: 6 },
              flexWrap: 'wrap',
            }}
          >
            {[
              { value: '50+',   label: 'Events Hosted' },
              { value: '10K+',  label: 'Happy Attendees' },
              { value: '100%',  label: 'Secure Booking' },
            ].map((stat) => (
              <Box key={stat.label} textAlign="center">
                <Typography sx={{ fontSize: '1.7rem', fontWeight: 800, color: '#FCD34D', lineHeight: 1.1 }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500, mt: 0.3 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Box>

      {/* ═══════════════════════════════════ FEATURES ════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={fadeUp}>
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center', mb: 1.5, fontWeight: 700,
                  color: 'secondary.dark', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.78rem',
                }}
              >
                Why Choose Us
              </Typography>
              <Typography variant="h3" sx={{ textAlign: 'center', mb: 8, color: 'primary.main' }}>
                Everything you need for an epic event
              </Typography>
            </motion.div>

            <Grid container spacing={4}>
              {features.map((f) => (
                <Grid item xs={12} md={4} key={f.label}>
                  <motion.div variants={fadeUp}>
                    <motion.div initial="rest" whileHover="hover" variants={cardHover} style={{ height: '100%' }}>
                    <Card sx={{ p: 1, height: '100%' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            width: 52, height: 52, borderRadius: 3, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', mb: 2.5,
                            background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.06) 100%)',
                            color: 'secondary.dark',
                          }}
                        >
                          {f.icon}
                        </Box>
                        <Typography variant="h6" fontWeight={700} mb={1} color="primary.main">{f.label}</Typography>
                        <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
                      </CardContent>
                    </Card>
                    </motion.div>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* ════════════════════════════ FEATURED EVENTS ════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(180deg, #F1F5F9 0%, #F8FAFC 100%)' }}>
        <Container maxWidth="lg">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <motion.div variants={fadeUp}>
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center', mb: 1.5, fontWeight: 700,
                  color: 'secondary.dark', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.78rem',
                }}
              >
                Featured
              </Typography>
              <Typography variant="h3" sx={{ textAlign: 'center', mb: 8, color: 'primary.main' }}>
                Celebrate With Us
              </Typography>
            </motion.div>

            <Grid container spacing={4}>
              {featuredCards.map((card) => (
                <Grid item xs={12} md={4} key={card.title}>
                  <motion.div variants={fadeUp}>
                    <motion.div initial="rest" whileHover="hover" variants={cardHover} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Card
                      sx={{
                        height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden',
                        border: '1px solid rgba(148,163,184,0.12)',
                      }}
                    >
                      {/* Image */}
                      <Box
                        sx={{
                          height: 220, overflow: 'hidden', position: 'relative',
                          background: '#E2E8F0',
                        }}
                      >
                        <Box
                          component="img"
                          src={card.image}
                          alt={card.title}
                          sx={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                            '.MuiCard-root:hover &': { transform: 'scale(1.06)' },
                          }}
                        />
                        {/* Tag badge */}
                        <Chip
                          label={card.tag}
                          size="small"
                          sx={{
                            position: 'absolute', top: 12, left: 12,
                            background: card.tagColor, color: '#fff',
                            fontWeight: 700, fontSize: '0.72rem',
                          }}
                        />
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography variant="h6" fontWeight={700} mb={1} color="primary.main">
                          {card.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" lineHeight={1.65}>
                          {card.desc}
                        </Typography>
                      </CardContent>
                    </Card>
                    </motion.div>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* CTA */}
            <motion.div variants={fadeUp}>
              <Box sx={{ textAlign: 'center', mt: 7 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={Link}
                  href="/events"
                  endIcon={<ArrowRight size={18} />}
                  sx={{ px: 5, py: 1.6, fontSize: '1rem' }}
                >
                  View All Events
                </Button>
              </Box>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
