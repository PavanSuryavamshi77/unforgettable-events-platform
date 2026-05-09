'use client';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production, send to an error tracking service like Sentry
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <Box sx={{
          minHeight: '60vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: '#F8FAFC',
        }}>
          <Container maxWidth="sm" sx={{ textAlign: 'center', py: 8 }}>
            <Box sx={{
              width: 72, height: 72, borderRadius: '50%', mx: 'auto', mb: 3,
              background: 'rgba(239,68,68,0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <AlertTriangle size={32} color="#EF4444" />
            </Box>
            <Typography variant="h5" fontWeight={700} color="primary.main" mb={1.5}>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              An unexpected error occurred. Please try refreshing the page.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              sx={{ fontWeight: 700, px: 4 }}
            >
              Refresh Page
            </Button>
          </Container>
        </Box>
      );
    }
    return this.props.children;
  }
}
