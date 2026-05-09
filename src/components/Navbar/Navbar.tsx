'use client';
import { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem,
  Avatar, Skeleton, Drawer, List, ListItem, ListItemButton,
  ListItemText, IconButton, Divider,
} from '@mui/material';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { Menu as MenuIcon, X } from 'lucide-react';

/* ── Nav links per role ─────────────────────────────────── */
const publicLinks  = [
  { label: 'Home',    href: '/' },
  { label: 'Events',  href: '/events' },
  { label: 'Gallery', href: '/gallery' },
];
const userLinks = [
  { label: 'Home',       href: '/' },
  { label: 'Events',     href: '/events' },
  { label: 'My Tickets', href: '/my-tickets' },
  { label: 'Gallery',    href: '/gallery' },
];
const adminLinks = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Events',    href: '/events' },
];

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const [anchorEl,   setAnchorEl]   = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setAnchorEl(null);
    setMobileOpen(false);
    router.push('/');
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  /* Pick the right link set */
  const isAdmin   = user?.role === 'ADMIN';
  const navLinks  = isLoading
    ? publicLinks
    : isAuthenticated && isAdmin
      ? adminLinks
      : isAuthenticated
        ? userLinks
        : publicLinks;

  return (
    <>
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'sticky', top: 0, zIndex: 1100 }}
      >
        <AppBar position="static" elevation={0} sx={{
          background: scrolled ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          borderBottom: scrolled ? '1px solid rgba(148,163,184,0.18)' : '1px solid rgba(148,163,184,0.10)',
          transition: 'all 0.3s ease',
        }}>
          <Toolbar sx={{ minHeight: { xs: 64, md: 72 }, px: { xs: 2, md: 4 } }}>

            {/* Logo */}
            <Typography component={Link} href="/" variant="h6" sx={{
              flexGrow: 1, fontWeight: 800, letterSpacing: '-0.02em', textDecoration: 'none',
              background: 'linear-gradient(135deg, #0F172A 0%, #475569 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1.05rem', md: '1.2rem' },
            }}>
              🎊 Unforgettable
            </Typography>

            {/* Desktop nav */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}>
              {navLinks.map((link) => (
                <Button key={link.href} component={Link} href={link.href} sx={{
                  px: 2, py: 1, borderRadius: 2,
                  color: isActive(link.href) ? 'secondary.dark' : 'text.secondary',
                  fontWeight: isActive(link.href) ? 700 : 500, fontSize: '0.9rem',
                  background: isActive(link.href) ? 'rgba(245,158,11,0.1)' : 'transparent',
                  '&:hover': { background: 'rgba(245,158,11,0.08)', color: 'secondary.dark', transform: 'none', boxShadow: 'none' },
                }}>
                  {link.label}
                </Button>
              ))}

              <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: 'rgba(148,163,184,0.25)' }} />

              {/* Auth zone */}
              {isLoading ? (
                <Skeleton variant="circular" width={38} height={38} />
              ) : isAuthenticated && user ? (
                <>
                  <Avatar
                    sx={{
                      width: 38, height: 38, cursor: 'pointer',
                      background: isAdmin
                        ? 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                        : 'linear-gradient(135deg, #F59E0B, #D97706)',
                      color: '#fff', fontWeight: 800, fontSize: '0.9rem',
                      boxShadow: isAdmin
                        ? '0 2px 12px rgba(99,102,241,0.4)'
                        : '0 2px 12px rgba(245,158,11,0.4)',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.08)' },
                    }}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                  >
                    {user.name?.[0]?.toUpperCase() ?? '?'}
                  </Avatar>
                  <Menu
                    anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}
                    PaperProps={{ sx: { mt: 1.5, minWidth: 200, borderRadius: 3,
                      border: '1px solid rgba(148,163,184,0.15)', boxShadow: '0 12px 40px rgba(15,23,42,0.12)' } }}
                  >
                    <MenuItem disabled sx={{ opacity: '1 !important' }}>
                      <Box>
                        <Typography fontWeight={700} color="text.primary" fontSize="0.9rem">{user.name}</Typography>
                        <Typography variant="caption" color="text.disabled">{isAdmin ? '👑 Administrator' : '🎟️ Member'}</Typography>
                      </Box>
                    </MenuItem>
                    <Divider />
                    {isAdmin ? (
                      <MenuItem component={Link} href="/admin" onClick={() => setAnchorEl(null)} sx={{ fontWeight: 600, gap: 1 }}>
                        🛠️ Admin Dashboard
                      </MenuItem>
                    ) : (
                      <MenuItem component={Link} href="/my-tickets" onClick={() => setAnchorEl(null)} sx={{ fontWeight: 600, gap: 1 }}>
                        🎟️ My Tickets
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main', fontWeight: 600 }}>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button component={Link} href="/login" variant="outlined" size="small" sx={{
                    mr: 1, borderRadius: 50, borderColor: 'rgba(15,23,42,0.22)', color: 'text.primary',
                    '&:hover': { borderColor: 'primary.main', transform: 'none', boxShadow: 'none' },
                  }}>
                    Login
                  </Button>
                  <Button component={Link} href="/register" variant="contained" color="secondary" size="small"
                    sx={{ borderRadius: 50 }}>
                    Get Started
                  </Button>
                </>
              )}
            </Box>

            {/* Mobile hamburger */}
            <IconButton sx={{ display: { xs: 'flex', md: 'none' }, color: 'text.primary', ml: 1 }}
              onClick={() => setMobileOpen(true)}>
              <MenuIcon size={22} />
            </IconButton>
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 280, background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(148,163,184,0.18)' } }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography fontWeight={800} letterSpacing="-0.02em">🎊 Unforgettable</Typography>
          <IconButton onClick={() => setMobileOpen(false)} size="small"><X size={20} /></IconButton>
        </Box>
        <Divider />

        {/* User info banner */}
        {isAuthenticated && user && (
          <>
            <Box sx={{ px: 2, py: 1.5, background: isAdmin ? 'rgba(99,102,241,0.08)' : 'rgba(245,158,11,0.08)' }}>
              <Typography variant="caption" color="text.disabled" fontWeight={600} textTransform="uppercase" fontSize="0.68rem">
                Signed in as
              </Typography>
              <Typography fontWeight={700} color="primary.main" fontSize="0.9rem">{user.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {isAdmin ? '👑 Administrator' : '🎟️ Member'}
              </Typography>
            </Box>
            <Divider />
          </>
        )}

        <List sx={{ pt: 1 }}>
          {navLinks.map((link) => (
            <ListItem key={link.href} disablePadding>
              <ListItemButton component={Link} href={link.href}
                onClick={() => setMobileOpen(false)} selected={isActive(link.href)}
                sx={{ mx: 1, borderRadius: 2, mb: 0.5,
                  '&.Mui-selected': { background: 'rgba(245,158,11,0.1)', color: 'secondary.dark' } }}>
                <ListItemText primary={link.label}
                  primaryTypographyProps={{ fontWeight: isActive(link.href) ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ mt: 1 }} />
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {isAuthenticated && user ? (
            <Button variant="contained" color="error" fullWidth onClick={handleLogout} sx={{ fontWeight: 700 }}>
              Logout
            </Button>
          ) : (
            <>
              <Button component={Link} href="/login" variant="outlined" fullWidth onClick={() => setMobileOpen(false)}>
                Login
              </Button>
              <Button component={Link} href="/register" variant="contained" color="secondary" fullWidth
                onClick={() => setMobileOpen(false)}>
                Get Started
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
}
