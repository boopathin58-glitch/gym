import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const inputStyle = { width: '100%', padding: '10px 12px', background: '#1a1e24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', color: '#eef0f4', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#7a8294', marginBottom: '5px' };

export default function RegisterPage() {
  const { register, googleLogin, loading } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('member');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '', specialty: '', experience: '', certifications: '', fitnessGoal: 'general_fitness' });
  const [error, setError] = useState('');

  const handleInput = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(''); };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.password) { setError('Please fill in all required fields.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    const payload = { name: `${form.firstName} ${form.lastName}`.trim(), email: form.email, password: form.password, role, phone: form.phone, specialty: form.specialty, experience: form.experience, certifications: form.certifications, fitnessGoal: form.fitnessGoal };
    const res = await register(payload);
    if (res.success) navigate('/dashboard');
    else setError(res.message);
  };

  const handleGoogle = useGoogleLogin({
    onSuccess: async (tokenRes) => {
      const res = await googleLogin(tokenRes.access_token, role, 'access_token');
      if (res.success) navigate('/dashboard');
      else setError(res.message);
    },
    onError: () => setError('Google sign-in failed.')
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0d0f12', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 800, color: '#eef0f4', textDecoration: 'none' }}>
            <span style={{ width: '32px', height: '32px', background: '#4f8ef7', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💪</span>GymPro
          </Link>
        </div>

        <div style={{ background: '#13161a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px', maxHeight: '85vh', overflowY: 'auto' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.4px', marginBottom: '6px', color: '#eef0f4' }}>Create your account</h1>
          <p style={{ color: '#7a8294', fontSize: '13px', marginBottom: '22px' }}>Join GymPro — choose your role to get started</p>

          {/* Role tabs */}
          <div style={{ display: 'flex', background: '#1a1e24', borderRadius: '9px', padding: '3px', marginBottom: '20px', gap: '3px' }}>
            {['member', 'trainer'].map(r => (
              <button key={r} onClick={() => { setRole(r); setError(''); }} style={{ flex: 1, padding: '9px', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: role === r ? '#4f8ef7' : 'transparent', color: role === r ? '#fff' : '#7a8294', transition: 'all .18s' }}>
                {r === 'member' ? '🏃 Member' : '🧑‍🏫 Trainer'}
              </button>
            ))}
          </div>

          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '12px' }}>{error}</div>}

          {/* Google */}
          <button onClick={() => handleGoogle()} disabled={loading} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', padding: '11px', background: '#1a1e24', border: '1px solid rgba(255,255,255,0.13)', borderRadius: '8px', color: '#eef0f4', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginBottom: '14px' }}>
            <svg width="17" height="17" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.215 17.64 11.906 17.64 9.2Z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/></svg>
            Sign up with Google as {role === 'member' ? 'Member' : 'Trainer'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '12px 0', color: '#7a8294', fontSize: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />or with email<div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div><label style={labelStyle}>First name *</label><input style={inputStyle} name="firstName" placeholder="First" value={form.firstName} onChange={handleInput} required /></div>
              <div><label style={labelStyle}>Last name</label><input style={inputStyle} name="lastName" placeholder="Last" value={form.lastName} onChange={handleInput} /></div>
            </div>
            <div><label style={labelStyle}>Email address *</label><input style={inputStyle} name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleInput} required /></div>
            <div><label style={labelStyle}>Phone number</label><input style={inputStyle} name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handleInput} /></div>

            {role === 'trainer' && <>
              <div><label style={labelStyle}>Specialty *</label><input style={inputStyle} name="specialty" placeholder="e.g. Strength & Conditioning" value={form.specialty} onChange={handleInput} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><label style={labelStyle}>Years of experience</label><input style={inputStyle} name="experience" type="number" placeholder="5" min="0" value={form.experience} onChange={handleInput} /></div>
                <div><label style={labelStyle}>Certifications</label><input style={inputStyle} name="certifications" placeholder="NASM-CPT, ACE" value={form.certifications} onChange={handleInput} /></div>
              </div>
            </>}

            {role === 'member' && (
              <div><label style={labelStyle}>Fitness goal</label>
                <select style={inputStyle} name="fitnessGoal" value={form.fitnessGoal} onChange={handleInput}>
                  <option value="general_fitness">General Fitness</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="endurance">Endurance</option>
                  <option value="flexibility">Flexibility</option>
                </select>
              </div>
            )}

            <div><label style={labelStyle}>Password *</label><input style={inputStyle} name="password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={handleInput} required /></div>
            <div><label style={labelStyle}>Confirm password *</label><input style={inputStyle} name="confirm" type="password" placeholder="Repeat password" value={form.confirm} onChange={handleInput} required /></div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#4f8ef7', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Creating account…' : `Create ${role === 'member' ? 'Member' : 'Trainer'} account`}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '18px', fontSize: '12px', color: '#7a8294' }}>
            Already have an account? <Link to="/login" style={{ color: '#4f8ef7', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
