'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Box, Typography, Container, Grid, Card, CardContent, CardActions,
  Button, Skeleton, Chip, InputAdornment, TextField, MenuItem,
  Select, FormControl, InputLabel, Collapse, IconButton, Pagination,
} from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Search, SlidersHorizontal, X, Calendar, MapPin, Clock, Ticket } from 'lucide-react';

/* ── Types ──────────────────────────────────────────────── */
interface EventItem {
  id: string; title: string; description: string;
  date: string; location: string; image: string;
  price: number; type: string;
  _count?: { bookings: number };
}
interface Pagination {
  page: number; pageSize: number; total: number;
  totalPages: number; hasNext: boolean; hasPrev: boolean;
}

/* ── Variants ───────────────────────────────────────────── */
const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

/* ── Skeleton card ──────────────────────────────────────── */
function CardSkeleton() {
  return (
    <Card sx={{ overflow: 'hidden' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent sx={{ p: 2.5 }}>
        <Skeleton width="60%" height={26} sx={{ mb: 1 }} />
        <Skeleton width="45%" height={18} sx={{ mb: 0.5 }} />
        <Skeleton width="40%" height={18} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" height={38} sx={{ borderRadius: 50 }} />
      </CardContent>
    </Card>
  );
}

/* ── Event card ─────────────────────────────────────────── */
function EventCard({ event }: { event: EventItem }) {
  const d = new Date(event.date);
  const isUpcoming = event.type === 'UPCOMING';
  return (
    <motion.div variants={cardVariants} layout style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ position: 'relative', height: 200, overflow: 'hidden', background: '#E2E8F0', flexShrink: 0 }}>
          <Box component="img" src={event.image || '/gallery/default.jpg'} alt={event.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', '.MuiCard-root:hover &': { transform: 'scale(1.05)' } }} />
          <Box sx={{ position: 'absolute', top: 10, left: 10, background: 'rgba(15,23,42,0.82)', backdropFilter: 'blur(6px)',
            borderRadius: 2, px: 1.2, py: 0.6, textAlign: 'center', minWidth: 40 }}>
            <Typography sx={{ color: '#FCD34D', fontWeight: 800, fontSize: '1rem', lineHeight: 1 }}>{d.getDate()}</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.06em' }}>
              {d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()}
            </Typography>
          </Box>
          <Chip label={isUpcoming ? 'Upcoming' : 'Past'} size="small"
            sx={{ position: 'absolute', top: 10, right: 10, fontWeight: 700, fontSize: '0.68rem',
              background: isUpcoming ? 'rgba(16,185,129,0.9)' : 'rgba(100,116,139,0.82)', color: '#fff' }} />
        </Box>
        <CardContent sx={{ flexGrow: 1, p: 2.5, pb: 1 }}>
          <Typography variant="h6" fontWeight={700} color="primary.main" mb={1.2} lineHeight={1.25}
            sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {event.title}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'text.secondary' }}>
              <MapPin size={13} /><Typography variant="caption" fontWeight={500}>{event.location}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'text.secondary' }}>
              <Clock size={13} /><Typography variant="caption" fontWeight={500}>
                {d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography fontWeight={800} color={event.price ? 'secondary.dark' : 'success.main'} fontSize="1rem">
              {event.price ? `₹${event.price}` : 'FREE'}
            </Typography>
            {event._count?.bookings !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled' }}>
                <Ticket size={12} /><Typography variant="caption" fontWeight={600}>{event._count.bookings}</Typography>
              </Box>
            )}
          </Box>
        </CardContent>
        <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
          <Button fullWidth variant={isUpcoming ? 'contained' : 'outlined'} color={isUpcoming ? 'secondary' : 'primary'}
            component={Link} href={`/events/${event.id}`}
            sx={{ fontWeight: 700, py: 1.1, ...(isUpcoming ? {} : { borderColor: 'rgba(15,23,42,0.22)', color: 'primary.main',
              '&:hover': { borderColor: 'primary.main', background: 'rgba(15,23,42,0.04)', transform: 'none', boxShadow: 'none' } }) }}>
            {isUpcoming ? '🎟️ Book Now' : 'View Details'}
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
}

/* ══════════════════════════════════ PAGE ══════════════════ */
export default function EventsPage() {
  const router     = useRouter();
  const pathname   = usePathname();
  const searchParams = useSearchParams();

  /* ── State from URL ───────────────────────────────────── */
  const [q,        setQ]        = useState(searchParams.get('q')        ?? '');
  const [type,     setType]     = useState(searchParams.get('type')     ?? '');
  const [location, setLocation] = useState(searchParams.get('location') ?? '');
  const [dateFrom, setDateFrom] = useState(searchParams.get('dateFrom') ?? '');
  const [dateTo,   setDateTo]   = useState(searchParams.get('dateTo')   ?? '');
  const [sort,     setSort]     = useState(searchParams.get('sort')     ?? 'date');
  const [order,    setOrder]    = useState(searchParams.get('order')    ?? 'asc');
  const [page,     setPage]     = useState(parseInt(searchParams.get('page') ?? '1', 10));

  /* ── Data state ─────────────────────────────────────────*/
  const [events,     setEvents]     = useState<EventItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  /* ── Debounce ref ────────────────────────────────────── */
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Build URL + fetch ───────────────────────────────── */
  const buildParams = useCallback((overrides: Record<string, string> = {}) => {
    const p = new URLSearchParams();
    const current = { q, type, location, dateFrom, dateTo, sort, order, page: String(page) };
    const merged  = { ...current, ...overrides };
    Object.entries(merged).forEach(([k, v]) => { if (v) p.set(k, v); });
    return p;
  }, [q, type, location, dateFrom, dateTo, sort, order, page]);

  const fetchEvents = useCallback(async (params: URLSearchParams) => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/events?${params}`);
      const data = await res.json();
      setEvents(data.events ?? []);
      setPagination(data.pagination ?? null);
    } catch { setEvents([]); }
    finally  { setLoading(false); }
  }, []);

  /* ── Sync URL → state → fetch on mount ─────────────── */
  useEffect(() => {
    const params = buildParams();
    router.replace(`${pathname}?${params}`, { scroll: false });
    fetchEvents(params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, location, dateFrom, dateTo, sort, order, page]);

  /* ── Debounced search (q only) ───────────────────────── */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = buildParams({ q, page: '1' });
      setPage(1);
      router.replace(`${pathname}?${params}`, { scroll: false });
      fetchEvents(params);
    }, 380);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const resetFilters = () => {
    setQ(''); setType(''); setLocation(''); setDateFrom(''); setDateTo('');
    setSort('date'); setOrder('asc'); setPage(1);
  };

  const activeFilters = [type, location, dateFrom, dateTo].filter(Boolean).length;

  const inputSx = {
    '& .MuiOutlinedInput-root': { borderRadius: 2.5, background: '#FFFFFF' },
  };

  return (
    <Box sx={{ background: '#F8FAFC', minHeight: '100vh', pb: 10 }}>
      {/* ── Header ───────────────────────────────────────── */}
      <Box sx={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 100%)',
        pt: { xs: 7, md: 10 }, pb: { xs: 8, md: 11 }, px: 3,
        textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 120%, rgba(245,158,11,0.22) 0%, transparent 65%)',
          pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <Typography variant="h3" sx={{ color: '#FFFFFF', mb: 1.5 }}>Find Your Next Event</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.55)', mb: 4, fontSize: '1rem' }}>
            Search, filter, and book from our curated collection of events.
          </Typography>

          {/* ── Search bar ─────────────────────────────────── */}
          <Box sx={{ maxWidth: 560, mx: 'auto', display: 'flex', gap: 1.5 }}>
            <TextField
              fullWidth placeholder="Search events, venues, locations…"
              value={q} onChange={(e) => setQ(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} color="#94A3B8" />
                  </InputAdornment>
                ),
                endAdornment: q ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setQ('')}><X size={16} /></IconButton>
                  </InputAdornment>
                ) : null,
                sx: { borderRadius: 50, background: '#FFFFFF', pl: 2, pr: 1 },
              }}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.12)' } }}
            />
            <Button
              variant={showFilters ? 'contained' : 'outlined'}
              color="secondary"
              onClick={() => setShowFilters(!showFilters)}
              startIcon={<SlidersHorizontal size={16} />}
              sx={{
                borderRadius: 50, whiteSpace: 'nowrap', flexShrink: 0, fontWeight: 700,
                ...(showFilters ? {} : { borderColor: 'rgba(255,255,255,0.3)', color: '#FFFFFF',
                  '&:hover': { borderColor: '#FFFFFF', background: 'rgba(255,255,255,0.08)' } }),
              }}
            >
              Filters {activeFilters > 0 && `(${activeFilters})`}
            </Button>
          </Box>
        </motion.div>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 1 }}>
        {/* ── Filters panel ──────────────────────────────── */}
        <Collapse in={showFilters}>
          <Card sx={{ mb: 4, p: { xs: 2.5, md: 3 }, borderRadius: 3,
            border: '1px solid rgba(148,163,184,0.18)', background: 'rgba(255,255,255,0.95)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
              <Typography fontWeight={700} color="primary.main">Refine Results</Typography>
              {activeFilters > 0 && (
                <Button size="small" variant="text" startIcon={<X size={14} />} onClick={resetFilters}
                  sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', transform: 'none', boxShadow: 'none' } }}>
                  Clear all
                </Button>
              )}
            </Box>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small" sx={inputSx}>
                  <InputLabel>Event Type</InputLabel>
                  <Select value={type} label="Event Type" onChange={(e) => { setType(e.target.value); setPage(1); }}>
                    <MenuItem value="">All Events</MenuItem>
                    <MenuItem value="UPCOMING">Upcoming</MenuItem>
                    <MenuItem value="PAST">Past</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField fullWidth size="small" label="Location" placeholder="e.g. Mumbai"
                  value={location} onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><MapPin size={14} color="#94A3B8" /></InputAdornment> }}
                  sx={inputSx} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField fullWidth size="small" label="From Date" type="date"
                  value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Calendar size={14} color="#94A3B8" /></InputAdornment> }}
                  sx={inputSx} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField fullWidth size="small" label="To Date" type="date"
                  value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Calendar size={14} color="#94A3B8" /></InputAdornment> }}
                  sx={inputSx} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small" sx={inputSx}>
                  <InputLabel>Sort By</InputLabel>
                  <Select value={`${sort}_${order}`} label="Sort By"
                    onChange={(e) => {
                      const [s, o] = e.target.value.split('_');
                      setSort(s); setOrder(o); setPage(1);
                    }}>
                    <MenuItem value="date_asc">Date: Earliest</MenuItem>
                    <MenuItem value="date_desc">Date: Latest</MenuItem>
                    <MenuItem value="price_asc">Price: Low → High</MenuItem>
                    <MenuItem value="price_desc">Price: High → Low</MenuItem>
                    <MenuItem value="title_asc">Name: A → Z</MenuItem>
                    <MenuItem value="createdAt_desc">Newest Added</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Card>
        </Collapse>

        {/* ── Active filter chips ─────────────────────────── */}
        {activeFilters > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            {type     && <Chip label={type === 'UPCOMING' ? 'Upcoming' : 'Past'} onDelete={() => setType('')} size="small" sx={{ fontWeight: 600 }} />}
            {location && <Chip label={`📍 ${location}`} onDelete={() => setLocation('')} size="small" sx={{ fontWeight: 600 }} />}
            {dateFrom && <Chip label={`From ${dateFrom}`} onDelete={() => setDateFrom('')} size="small" sx={{ fontWeight: 600 }} />}
            {dateTo   && <Chip label={`To ${dateTo}`}   onDelete={() => setDateTo('')}   size="small" sx={{ fontWeight: 600 }} />}
          </Box>
        )}

        {/* ── Result count ────────────────────────────────── */}
        {!loading && pagination && (
          <Typography variant="body2" color="text.secondary" mb={3} fontWeight={500}>
            {pagination.total === 0
              ? 'No events found'
              : `Showing ${(page - 1) * pagination.pageSize + 1}–${Math.min(page * pagination.pageSize, pagination.total)} of ${pagination.total} event${pagination.total !== 1 ? 's' : ''}`}
            {q && <> matching <strong>&quot;{q}&quot;</strong></>}
          </Typography>
        )}

        {/* ── Grid ────────────────────────────────────────── */}
        <AnimatePresence mode="popLayout">
          {loading ? (
            <Grid container spacing={3} key="skeleton">
              {Array.from({ length: 9 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}><CardSkeleton /></Grid>
              ))}
            </Grid>
          ) : events.length === 0 ? (
            <motion.div key="empty" variants={cardVariants} initial="hidden" animate="visible">
              <Box sx={{ textAlign: 'center', py: 12, background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(12px)', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 4 }}>
                <Typography fontSize="3.5rem" mb={2}>🔍</Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main" mb={1.5}>No events found</Typography>
                <Typography variant="body2" color="text.secondary" mb={4}>
                  Try adjusting your search terms or clearing filters.
                </Typography>
                <Button variant="outlined" onClick={resetFilters}
                  sx={{ borderColor: 'rgba(15,23,42,0.22)', color: 'primary.main',
                    '&:hover': { borderColor: 'primary.main', background: 'rgba(15,23,42,0.04)', transform: 'none', boxShadow: 'none' } }}>
                  Clear all filters
                </Button>
              </Box>
            </motion.div>
          ) : (
            <motion.div key={`grid-${page}-${q}-${type}`}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
              initial="hidden" animate="visible">
              <Grid container spacing={3}>
                {events.map((event) => (
                  <Grid item xs={12} sm={6} md={4} key={event.id} sx={{ display: 'flex' }}>
                    <EventCard event={event} />
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pagination ───────────────────────────────────── */}
        {pagination && pagination.totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={pagination.totalPages}
              page={page}
              onChange={(_, v) => { setPage(v); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              color="secondary"
              shape="rounded"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': { fontWeight: 600, borderRadius: 2 },
                '& .Mui-selected': { background: 'linear-gradient(135deg,#F59E0B,#FBBF24)', color: '#0F172A' },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
