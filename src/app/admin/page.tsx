'use client';
import { useEffect, useState } from 'react';
import {
  Box, Typography, Container, Grid, Card, CardContent, CardMedia, Button,
  Tabs, Tab, TextField, Alert, CircularProgress, IconButton, Chip, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Trash2, Plus, QrCode, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type EventData = {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  image: string;
  price: number;
  _count?: { bookings: number };
};

const defaultForm = {
  title: '', description: '', date: '', location: '', image: '', price: '0', type: 'UPCOMING',
  schedule: '[{"time":"6:30 PM","activity":"Entry open"},{"time":"7:00 PM","activity":"Opening ceremony"}]'
};

export default function AdminDashboard() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(defaultForm);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
    if (!user || user.role !== 'ADMIN') {
      router.push('/admin/login');
      return;
    }
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events', { credentials: 'include' });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      // API now returns { events, pagination } shape
      setEvents(data.events ?? data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(''); setFormSuccess('');
    try {
      let schedule = [];
      try { schedule = JSON.parse(form.schedule); } catch { }
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, schedule }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create event');
      setFormSuccess('Event created successfully!');
      setForm(defaultForm);
      fetchEvents();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      setDeleteDialog(null);
      fetchEvents();
    } catch { }
  };

  const upcoming = events.filter(e => e.type === 'UPCOMING');
  const past = events.filter(e => e.type === 'PAST');
  const displayed = tab === 0 ? upcoming : past;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 6 }}>
        <Box>
          <Typography variant="h3" fontWeight="bold" color="primary.main">Admin Dashboard</Typography>
          <Typography color="text.secondary">Manage events, bookings and tickets</Typography>
        </Box>
        <Button variant="outlined" color="primary" component={Link} href="/admin/scan" startIcon={<QrCode size={18} />}>
          QR Scanner
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          { label: 'Total Events', value: events.length, color: '#778899' },
          { label: 'Upcoming Events', value: upcoming.length, color: '#FFD700' },
          { label: 'Past Events', value: past.length, color: '#6c757d' },
        ].map((stat) => (
          <Grid item xs={12} md={4} key={stat.label}>
            <Card sx={{ borderLeft: `6px solid ${stat.color}`, p: 1 }}>
              <CardContent>
                <Typography variant="h3" fontWeight="bold" sx={{ color: stat.color }}>{stat.value}</Typography>
                <Typography variant="h6" color="text.secondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={6}>
        {/* Add Event Form */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 2, borderRadius: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Plus size={24} color="#778899" />
                <Typography variant="h5" fontWeight="bold" color="primary.main">Add New Event</Typography>
              </Box>

              {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
              {formSuccess && <Alert severity="success" sx={{ mb: 2 }}>{formSuccess}</Alert>}

              <form onSubmit={handleCreateEvent}>
                {[
                  { label: 'Title', key: 'title' },
                  { label: 'Description', key: 'description', multiline: true },
                  { label: 'Location', key: 'location' },
                  { label: 'Image URL', key: 'image' },
                  { label: 'Price (₹)', key: 'price' },
                ].map(({ label, key, multiline }) => (
                  <TextField
                    key={key} fullWidth label={label} variant="outlined"
                    value={(form as any)[key]} rows={multiline ? 3 : 1} multiline={multiline}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    sx={{ mb: 2 }} required
                  />
                ))}

                <TextField
                  fullWidth label="Date & Time" type="datetime-local" variant="outlined"
                  value={form.date}
                  onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
                  sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} required
                />

                <TextField
                  select fullWidth label="Event Type" variant="outlined"
                  value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))}
                  sx={{ mb: 2 }}
                  SelectProps={{ native: true }}
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="PAST">Past</option>
                </TextField>

                <TextField
                  fullWidth label="Schedule (JSON Array)" variant="outlined" multiline rows={4}
                  value={form.schedule}
                  onChange={(e) => setForm(f => ({ ...f, schedule: e.target.value }))}
                  sx={{ mb: 3 }}
                  helperText='[{"time":"7:00 PM","activity":"Entry"}]'
                />

                <Button type="submit" variant="contained" color="secondary" fullWidth
                  sx={{ py: 1.5, fontWeight: 'bold', color: '#000' }}
                >
                  Create Event
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Events List */}
        <Grid item xs={12} md={7}>
          <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>All Events</Typography>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
            <Tab label={`Upcoming (${upcoming.length})`} />
            <Tab label={`Past (${past.length})`} />
          </Tabs>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
          ) : displayed.length === 0 ? (
            <Typography textAlign="center" color="text.secondary">No events found.</Typography>
          ) : (
            displayed.map((event) => (
              <Card key={event.id} sx={{ mb: 2, display: 'flex', alignItems: 'center', p: 1, gap: 2 }}>
                <CardMedia
                  component="img"
                  image={event.image || '/gallery/default.jpg'}
                  alt={event.title}
                  sx={{ width: 90, height: 80, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
                />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography fontWeight="bold" noWrap>{event.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{new Date(event.date).toLocaleDateString()} · {event.location}</Typography>
                  <Typography variant="caption" color="primary.main" sx={{ display: 'block', mt: 0.5 }}>₹{event.price}</Typography>
                  <Box sx={{ mt: 0.5, display: 'flex', gap: 1 }}>
                    <Chip label={event.type} size="small" color={event.type === 'UPCOMING' ? 'secondary' : 'default'} />
                    <Chip label={`Bookings: ${event._count?.bookings || 0}`} size="small" variant="outlined" />
                  </Box>
                </Box>
                <IconButton color="error" onClick={() => setDeleteDialog(event.id)} title="Delete event">
                  <Trash2 size={20} />
                </IconButton>
              </Card>
            ))
          )}
        </Grid>
      </Grid>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle>Delete Event?</DialogTitle>
        <DialogContent>This action cannot be undone. All related bookings will also be deleted.</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => deleteDialog && handleDelete(deleteDialog)}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
