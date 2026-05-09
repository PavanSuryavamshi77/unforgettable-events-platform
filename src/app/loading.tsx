// src/app/loading.tsx
// Next.js automatically renders this as the Suspense fallback
// during route transitions (page-level streaming SSR)
import { Box, Skeleton, Container } from '@mui/material';

export default function GlobalLoading() {
  return (
    <Box sx={{ background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Simulated header */}
      <Box sx={{
        background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)',
        height: { xs: 180, md: 220 }, position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 2,
      }}>
        <Skeleton variant="rounded" width={180} height={28} sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 50 }} />
        <Skeleton variant="rounded" width={320} height={42} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
        <Skeleton variant="rounded" width={240} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />
      </Box>

      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 5 }}>
          <Skeleton variant="rounded" width={130} height={42} sx={{ borderRadius: 50 }} />
          <Skeleton variant="rounded" width={100} height={42} sx={{ borderRadius: 50 }} />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <Box key={i} sx={{ borderRadius: '20px', overflow: 'hidden', background: '#fff', border: '1px solid rgba(148,163,184,0.15)' }}>
              <Skeleton variant="rectangular" height={200} />
              <Box sx={{ p: 2.5 }}>
                <Skeleton width="65%" height={26} sx={{ mb: 1 }} />
                <Skeleton width="45%" height={18} sx={{ mb: 0.5 }} />
                <Skeleton width="40%" height={18} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" height={40} sx={{ borderRadius: 50 }} />
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
