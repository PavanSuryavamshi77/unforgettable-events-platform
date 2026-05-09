'use client';
import { useState } from 'react';
import { Box, Typography, Container, Card, CardContent, TextField, Button, Alert } from '@mui/material';

export default function AdminScanPage() {
  const [ticketId, setTicketId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to scan');
      
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4, textAlign: 'center' }}>
        Admin Ticket Scanner
      </Typography>

      <Card sx={{ p: 2, mb: 4 }}>
        <CardContent>
          <form onSubmit={handleScan}>
            <TextField
              fullWidth
              label="Enter Ticket ID (e.g. TKT-ABC12345)"
              variant="outlined"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large" 
              fullWidth
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Ticket'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      {result && result.valid && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="h6">Ticket is Valid!</Typography>
          <Box sx={{ mt: 1 }}>
            <Typography><strong>Event:</strong> {result.ticket.eventName}</Typography>
            <Typography><strong>User:</strong> {result.ticket.userName}</Typography>
            <Typography><strong>Ticket ID:</strong> {result.ticket.ticketId}</Typography>
          </Box>
        </Alert>
      )}
    </Container>
  );
}
