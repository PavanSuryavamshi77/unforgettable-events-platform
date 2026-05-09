'use client';
import { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Link as MuiLink, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';

const features = [
  { icon: '🎊', text: 'Book exclusive cultural festivals' },
  { icon: '🎟️', text: 'Instant QR tickets on your phone' },
  { icon: '🔒', text: 'Secure payments & data privacy' },
  { icon: '📍', text: 'Events across India' },
];

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get('redirect') ?? '/events';
  const setUser      = useAuthStore((s) => s.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res  = await fetch('/api/auth/login', { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password}) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid credentials');
      setUser({ id:data.id, name:data.name, email:data.email, role:data.role });
      router.push(redirectTo);
    } catch (err:any) { setError(err.message); }
    finally { setLoading(false); }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2.5, background: '#FFFFFF',
      '&:hover fieldset': { borderColor: '#F59E0B' },
      '&.Mui-focused fieldset': { borderColor: '#F59E0B', borderWidth: 2 },
    },
  };

  return (
    <Box sx={{ display:'flex', minHeight:'100vh' }}>

      {/* LEFT — dark branding panel */}
      <Box sx={{
        display:{ xs:'none', md:'flex' }, flex:'0 0 46%',
        flexDirection:'column', justifyContent:'center', alignItems:'flex-start',
        px:{ md:7, lg:9 }, position:'relative', overflow:'hidden',
        background:'linear-gradient(145deg,#0F172A 0%,#1E293B 55%,#0F172A 100%)',
      }}>
        {/* orbs */}
        <Box sx={{ position:'absolute', top:'-10%', right:'-8%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,0.22) 0%,transparent 70%)', pointerEvents:'none' }} />
        <Box sx={{ position:'absolute', bottom:'-8%', left:'-10%', width:340, height:340, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)', pointerEvents:'none' }} />
        {/* grid */}
        <Box sx={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize:'48px 48px' }} />

        <motion.div initial={{ opacity:0, x:-32 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.65, ease:[0.22,1,0.36,1] }} style={{ position:'relative', width:'100%' }}>
          {/* Logo */}
          <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mb:6 }}>
            <Box sx={{ width:44, height:44, borderRadius:2.5, background:'linear-gradient(135deg,#F59E0B,#D97706)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', boxShadow:'0 4px 20px rgba(245,158,11,0.4)' }}>🎊</Box>
            <Typography fontWeight={800} fontSize="1.25rem" sx={{ background:'linear-gradient(135deg,#FFFFFF 0%,rgba(255,255,255,0.7) 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Unforgettable</Typography>
          </Box>

          <Typography variant="h3" fontWeight={900} sx={{ color:'#FFFFFF', lineHeight:1.15, mb:2, letterSpacing:'-0.03em' }}>
            Every moment<br />
            <Box component="span" sx={{ background:'linear-gradient(135deg,#F59E0B 0%,#FBBF24 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>deserves a stage.</Box>
          </Typography>

          <Typography sx={{ color:'rgba(255,255,255,0.5)', mb:5, fontSize:'0.95rem', lineHeight:1.75, maxWidth:360 }}>
            Join thousands celebrating India's most unforgettable cultural events — from Navratri to live concerts.
          </Typography>

          <Box sx={{ display:'flex', flexDirection:'column', gap:2, mb:6 }}>
            {features.map((f,i) => (
              <motion.div key={f.text} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.15+i*0.1, duration:0.45 }}>
                <Box sx={{ display:'flex', alignItems:'center', gap:1.8 }}>
                  <Box sx={{ width:38, height:38, borderRadius:2, background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>{f.icon}</Box>
                  <Typography sx={{ color:'rgba(255,255,255,0.7)', fontWeight:500, fontSize:'0.92rem' }}>{f.text}</Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ display:'inline-flex', alignItems:'center', gap:1, px:2.5, py:1.2, borderRadius:50, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}>
            <Sparkles size={13} color="#F59E0B" />
            <Typography variant="caption" sx={{ color:'rgba(255,255,255,0.45)', fontWeight:600 }}>50+ events · 10,000+ attendees · 100% secure</Typography>
          </Box>
        </motion.div>
      </Box>

      {/* RIGHT — form panel */}
      <Box sx={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', px:{ xs:3, sm:6, lg:8 }, py:6, background:'#F8FAFC', position:'relative' }}>
        {/* amber top bar */}
        <Box sx={{ position:'absolute', top:0, left:0, right:0, height:4, background:'linear-gradient(90deg,#F59E0B,#FBBF24,#F59E0B)' }} />

        <Box sx={{ width:'100%', maxWidth:400 }}>
          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}>

            {/* Mobile logo */}
            <Box sx={{ display:{ xs:'flex', md:'none' }, alignItems:'center', gap:1.2, mb:4 }}>
              <Box sx={{ fontSize:'1.5rem' }}>🎊</Box>
              <Typography fontWeight={800} color="primary.main">Unforgettable</Typography>
            </Box>

            <Box mb={4}>
              <Typography variant="h4" fontWeight={900} color="primary.main" letterSpacing="-0.03em" mb={0.8}>Welcome back</Typography>
              <Typography color="text.secondary" fontSize="0.92rem">
                {redirectTo !== '/events' ? '🔐 Sign in to continue' : 'Sign in to your account'}
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb:3, borderRadius:2.5, fontSize:'0.85rem' }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ display:'flex', flexDirection:'column', gap:2.5 }}>
              <TextField fullWidth label="Email address" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"
                InputProps={{ startAdornment:<InputAdornment position="start"><Mail size={17} color="#94A3B8" /></InputAdornment> }}
                sx={inputSx} />

              <TextField fullWidth label="Password" type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password"
                InputProps={{
                  startAdornment:<InputAdornment position="start"><Lock size={17} color="#94A3B8" /></InputAdornment>,
                  endAdornment:<InputAdornment position="end"><IconButton size="small" onClick={()=>setShowPass(!showPass)} edge="end" tabIndex={-1}>{showPass?<EyeOff size={16} color="#94A3B8"/>:<Eye size={16} color="#94A3B8"/>}</IconButton></InputAdornment>,
                }}
                sx={inputSx} />

              <Button type="submit" variant="contained" color="secondary" size="large" fullWidth disabled={loading}
                sx={{ py:1.6, fontWeight:800, fontSize:'1rem', borderRadius:2.5, mt:0.5, boxShadow:'0 4px 20px rgba(245,158,11,0.4)', '&:hover':{ boxShadow:'0 6px 28px rgba(245,158,11,0.55)', transform:'translateY(-1px)' } }}>
                {loading ? <><CircularProgress size={18} sx={{ color:'#0F172A', mr:1.5 }} />Signing in…</> : '✨  Sign In'}
              </Button>
            </Box>

            <Box sx={{ display:'flex', alignItems:'center', gap:2, my:3.5 }}>
              <Box sx={{ flex:1, height:'1px', background:'rgba(148,163,184,0.3)' }} />
              <Typography variant="caption" color="text.disabled" fontWeight={600}>NEW HERE?</Typography>
              <Box sx={{ flex:1, height:'1px', background:'rgba(148,163,184,0.3)' }} />
            </Box>

            <Button fullWidth variant="outlined" component={Link} href={`/register${redirectTo!='/events'?`?redirect=${redirectTo}`:''}`}
              sx={{ py:1.4, borderRadius:2.5, fontWeight:700, borderColor:'rgba(15,23,42,0.2)', color:'primary.main', '&:hover':{ borderColor:'#F59E0B', color:'secondary.dark', background:'rgba(245,158,11,0.05)', transform:'none', boxShadow:'none' } }}>
              Create Free Account →
            </Button>

            <Typography textAlign="center" mt={2.5} fontSize="0.8rem">
              <MuiLink component={Link} href="/admin/login" sx={{ color:'text.disabled', textDecoration:'none', '&:hover':{ color:'text.secondary' } }}>
                Admin Login →
              </MuiLink>
            </Typography>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
