'use client';
import { useState } from 'react';
import { Box, Typography, Container, Card, CardContent, TextField, Button, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@unforgettable.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      if (data.role !== 'ADMIN') throw new Error('Access denied. Admins only.');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, email: data.email, role: data.role }));

      router.push('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2c3e50 0%, #778899 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 4, boxShadow: 10, p: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
              <ShieldCheck size={36} color="#778899" />
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                Admin Panel
              </Typography>
            </Box>
            <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
              Restricted access for event administrators
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth label="Admin Email" type="email" variant="outlined"
                value={email} onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }} required
              />
              <TextField
                fullWidth label="Password" type="password" variant="outlined"
                value={password} onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }} required
              />
              <Button
                type="submit" variant="contained" color="primary"
                size="large" fullWidth disabled={loading}
                sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
              >
                {loading ? 'Signing in...' : 'Admin Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
