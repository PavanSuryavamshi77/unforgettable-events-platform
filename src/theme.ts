import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F172A',    // Deep Navy
      light: '#1E293B',
      dark: '#020617',
    },
    secondary: {
      main: '#F59E0B',    // Amber Gold
      light: '#FCD34D',
      dark: '#D97706',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    success: { main: '#10B981' },
    error:   { main: '#EF4444' },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), "Inter", "Roboto", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.025em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.015em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, letterSpacing: '0.01em' },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.65 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*':          { scrollBehavior: 'smooth' },
        '::selection': { background: '#F59E0B44', color: '#0F172A' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          transition: 'all 0.2s ease',
          '&:hover':  { transform: 'translateY(-1px)', boxShadow: '0 8px 25px rgba(0,0,0,0.12)' },
          '&:active': { transform: 'translateY(0)' },
        },
        containedSecondary: {
          color: '#0F172A',
          background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
          boxShadow: '0 4px 14px rgba(245,158,11,0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
            boxShadow: '0 8px 20px rgba(245,158,11,0.5)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          boxShadow: '0 4px 14px rgba(15,23,42,0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
            boxShadow: '0 8px 20px rgba(15,23,42,0.45)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': { borderWidth: '1.5px' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid rgba(148,163,184,0.15)',
          boxShadow: '0 4px 24px rgba(15,23,42,0.06), 0 1px 4px rgba(15,23,42,0.04)',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          backdropFilter: 'blur(8px)',
          background: 'rgba(255,255,255,0.88)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: 'none', borderBottom: '1px solid rgba(148,163,184,0.12)' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 8 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover fieldset':      { borderColor: '#F59E0B' },
            '&.Mui-focused fieldset': { borderColor: '#F59E0B', borderWidth: 2 },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: { fontWeight: 700 },
      },
    },
  },
});

export default theme;
