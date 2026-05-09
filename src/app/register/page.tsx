'use client';
import { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Link as MuiLink, InputAdornment, IconButton, CircularProgress, LinearProgress } from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, CheckCircle } from 'lucide-react';

/* ── Password strength ──────────────────────────────────── */
function passwordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label:'Weak',   color:'#EF4444' };
  if (score <= 3) return { score, label:'Medium', color:'#F59E0B' };
  return              { score, label:'Strong', color:'#10B981' };
}

const perks = [
  '🎊 Access all upcoming events',
  '🎟️ Instant e-ticket & QR code',
  '📲 Booking history anytime',
  '🔔 Early-bird notifications',
];

export default function RegisterPage() {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get('redirect') ?? '/events';

  const strength = passwordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    try {
      const res  = await fetch('/api/auth/register', { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name,email,password}) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setSuccess('Account created! Redirecting…');
      setTimeout(() => router.push(`/login${redirectTo!=='/events'?`?redirect=${redirectTo}`:''}`), 1400);
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
        <Box sx={{ position:'absolute', top:'-8%', right:'-6%', width:380, height:380, borderRadius:'50%', background:'radial-gradient(circle,rgba(16,185,129,0.2) 0%,transparent 70%)', pointerEvents:'none' }} />
        <Box sx={{ position:'absolute', bottom:'-8%', left:'-8%', width:340, height:340, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,0.18) 0%,transparent 70%)', pointerEvents:'none' }} />
        <Box sx={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize:'48px 48px' }} />

        <motion.div initial={{ opacity:0, x:-32 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.65, ease:[0.22,1,0.36,1] }} style={{ position:'relative', width:'100%' }}>
          {/* Logo */}
          <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mb:6 }}>
            <Box sx={{ width:44, height:44, borderRadius:2.5, background:'linear-gradient(135deg,#F59E0B,#D97706)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', boxShadow:'0 4px 20px rgba(245,158,11,0.4)' }}>🎊</Box>
            <Typography fontWeight={800} fontSize="1.25rem" sx={{ background:'linear-gradient(135deg,#FFFFFF,rgba(255,255,255,0.7))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Unforgettable</Typography>
          </Box>

          <Typography variant="h3" fontWeight={900} sx={{ color:'#FFFFFF', lineHeight:1.15, mb:2, letterSpacing:'-0.03em' }}>
            Your next memory<br />
            <Box component="span" sx={{ background:'linear-gradient(135deg,#10B981,#34D399)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>starts here.</Box>
          </Typography>

          <Typography sx={{ color:'rgba(255,255,255,0.5)', mb:5, fontSize:'0.95rem', lineHeight:1.75, maxWidth:360 }}>
            Create your free account and unlock access to India's most vibrant cultural events.
          </Typography>

          {/* Perks */}
          <Box sx={{ display:'flex', flexDirection:'column', gap:2.2, mb:6 }}>
            {perks.map((p, i) => (
              <motion.div key={p} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.15+i*0.1, duration:0.45 }}>
                <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
                  <CheckCircle size={18} color="#10B981" />
                  <Typography sx={{ color:'rgba(255,255,255,0.7)', fontWeight:500, fontSize:'0.92rem' }}>{p}</Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ display:'inline-flex', alignItems:'center', gap:1, px:2.5, py:1.2, borderRadius:50, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}>
            <Sparkles size={13} color="#10B981" />
            <Typography variant="caption" sx={{ color:'rgba(255,255,255,0.45)', fontWeight:600 }}>Free to join · No credit card required</Typography>
          </Box>
        </motion.div>
      </Box>

      {/* RIGHT — form panel */}
      <Box sx={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', px:{ xs:3, sm:6, lg:8 }, py:6, background:'#F8FAFC', position:'relative' }}>
        {/* green top bar */}
        <Box sx={{ position:'absolute', top:0, left:0, right:0, height:4, background:'linear-gradient(90deg,#10B981,#34D399,#10B981)' }} />

        <Box sx={{ width:'100%', maxWidth:400 }}>
          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}>

            {/* Mobile logo */}
            <Box sx={{ display:{ xs:'flex', md:'none' }, alignItems:'center', gap:1.2, mb:4 }}>
              <Box sx={{ fontSize:'1.5rem' }}>🎊</Box>
              <Typography fontWeight={800} color="primary.main">Unforgettable</Typography>
            </Box>

            <Box mb={4}>
              <Typography variant="h4" fontWeight={900} color="primary.main" letterSpacing="-0.03em" mb={0.8}>Create account</Typography>
              <Typography color="text.secondary" fontSize="0.92rem">It's free and takes less than a minute</Typography>
            </Box>

            {error   && <Alert severity="error"   sx={{ mb:3, borderRadius:2.5, fontSize:'0.85rem' }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb:3, borderRadius:2.5, fontSize:'0.85rem' }}>{success}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ display:'flex', flexDirection:'column', gap:2.5 }}>
              <TextField fullWidth label="Full Name" value={name} onChange={e=>setName(e.target.value)} required autoComplete="name"
                InputProps={{ startAdornment:<InputAdornment position="start"><User size={17} color="#94A3B8" /></InputAdornment> }}
                sx={inputSx} />

              <TextField fullWidth label="Email address" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email"
                InputProps={{ startAdornment:<InputAdornment position="start"><Mail size={17} color="#94A3B8" /></InputAdornment> }}
                sx={inputSx} />

              <Box>
                <TextField fullWidth label="Password" type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="new-password"
                  InputProps={{
                    startAdornment:<InputAdornment position="start"><Lock size={17} color="#94A3B8" /></InputAdornment>,
                    endAdornment:<InputAdornment position="end"><IconButton size="small" onClick={()=>setShowPass(!showPass)} edge="end" tabIndex={-1}>{showPass?<EyeOff size={16} color="#94A3B8"/>:<Eye size={16} color="#94A3B8"/>}</IconButton></InputAdornment>,
                  }}
                  sx={inputSx} />
                {/* Strength bar */}
                {password && (
                  <Box sx={{ mt:1, px:0.5 }}>
                    <LinearProgress variant="determinate" value={(strength.score/5)*100}
                      sx={{ height:4, borderRadius:2, bgcolor:'rgba(148,163,184,0.2)',
                        '& .MuiLinearProgress-bar': { bgcolor: strength.color, transition:'all 0.3s ease' } }} />
                    <Typography variant="caption" sx={{ color: strength.color, fontWeight:700, mt:0.5, display:'block' }}>
                      {strength.label} password
                    </Typography>
                  </Box>
                )}
              </Box>

              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}
                sx={{ py:1.6, fontWeight:800, fontSize:'1rem', borderRadius:2.5, mt:0.5,
                  background:'linear-gradient(135deg,#10B981,#059669)',
                  boxShadow:'0 4px 20px rgba(16,185,129,0.35)',
                  '&:hover':{ boxShadow:'0 6px 28px rgba(16,185,129,0.5)', transform:'translateY(-1px)', background:'linear-gradient(135deg,#059669,#047857)' },
                  '&.Mui-disabled':{ background:'rgba(148,163,184,0.3)', color:'rgba(0,0,0,0.4)' } }}>
                {loading ? <><CircularProgress size={18} sx={{ color:'#fff', mr:1.5 }} />Creating Account…</> : '🚀  Create Free Account'}
              </Button>
            </Box>

            <Box sx={{ display:'flex', alignItems:'center', gap:2, my:3.5 }}>
              <Box sx={{ flex:1, height:'1px', background:'rgba(148,163,184,0.3)' }} />
              <Typography variant="caption" color="text.disabled" fontWeight={600}>ALREADY A MEMBER?</Typography>
              <Box sx={{ flex:1, height:'1px', background:'rgba(148,163,184,0.3)' }} />
            </Box>

            <Button fullWidth variant="outlined" component={Link} href={`/login${redirectTo!=='/events'?`?redirect=${redirectTo}`:''}`}
              sx={{ py:1.4, borderRadius:2.5, fontWeight:700, borderColor:'rgba(15,23,42,0.2)', color:'primary.main', '&:hover':{ borderColor:'primary.main', background:'rgba(15,23,42,0.04)', transform:'none', boxShadow:'none' } }}>
              Sign In →
            </Button>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
