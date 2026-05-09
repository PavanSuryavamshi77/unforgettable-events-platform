import { Box, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Box sx={{
      minHeight: '90vh',
      background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      px: 3, position: 'relative', overflow: 'hidden',
    }}>
      <Box sx={{
        position: 'absolute', top: '10%', left: '5%', width: 360, height: 360,
        borderRadius: '50%', background: 'rgba(245,158,11,0.12)', filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      <Container maxWidth="sm" sx={{ textAlign: 'center', position: 'relative' }}>
        <Typography sx={{ fontSize: { xs: '5rem', md: '8rem' }, fontWeight: 900, color: 'rgba(245,158,11,0.2)', lineHeight: 1, mb: 2 }}>
          404
        </Typography>
        <Typography fontSize="3rem" mb={2}>🎭</Typography>
        <Typography variant="h4" fontWeight={800} sx={{ color: '#FFFFFF', mb: 2 }}>
          This page is offstage
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.55)', mb: 5, fontSize: '1rem', maxWidth: 380, mx: 'auto' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to the show.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button component={Link} href="/" variant="contained" color="secondary" size="large"
            sx={{ fontWeight: 700, px: 4 }}>
            Back to Home
          </Button>
          <Button component={Link} href="/events" variant="outlined" size="large"
            sx={{ fontWeight: 600, px: 4, borderColor: 'rgba(255,255,255,0.3)', color: '#fff',
              '&:hover': { borderColor: '#fff', background: 'rgba(255,255,255,0.08)' } }}>
            Browse Events
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
