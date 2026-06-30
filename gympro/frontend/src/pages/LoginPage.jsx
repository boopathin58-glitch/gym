import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'

const S = {
  page: { minHeight: '100vh', background: '#0d0f12', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, sans-serif' },
  box: { background: '#13161a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '420px' },
  title: { fontSize: '22px', fontWeight: 900, letterSpacing: '-0.4px', marginBottom: '6px', color: '#eef0f4' },
  sub: { color: '#7a8294', fontSize: '13px', marginBottom: '24px' },
  roleTabs: { display: 'flex', background: '#1a1e24', borderRadius: '9px', padding: '3px', marginBottom: '20px', gap: '3px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 600, color: '#7a8294', marginBottom: '5px' },
  input: { width: '100%', padding: '10px 12px', background: '#1a1e24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', color: '#eef0f4', fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  err: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '12px' },
  ok: { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#86efac', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '12px' },
  gBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', padding: '11px', background: '#1a1e24', border: '1px solid rgba(255,255,255,0.13)', borderRadius: '8px', color: '#eef0f4', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginBottom: '14px' },
  divider: { display: 'flex', alignItems: 'center', gap: '10px', margin: '12px 0', color: '#7a8294', fontSize: '12px' },
  divLine: { flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' },
  submit: { width: '100%', padding: '12px', background: '#4f8ef7', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginTop: '6px' },
  toggle: { textAlign: 'center', marginTop: '18px', fontSize: '12px', color: '#7a8294' },
}

const GoogleSVG = () => (
  <svg width="17" height="17" viewBox="0 0 18 18">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.215 17.64 11.906 17.64 9.2Z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
  </svg>
)

export default function LoginPage() {
  const { login, googleLogin, loading } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('member')
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [forgotMode, setForgotMode] = useState(false)
  const [fpEmail, setFpEmail] = useState('')
  const [fpMsg, setFpMsg] = useState('')

  const handleInput = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError('') }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    const res = await login(form.email, form.password, role)
    if (res.success) navigate('/dashboard')
    else setError(res.message)
  }

  // useGoogleLogin returns an ACCESS TOKEN — send it to backend as access_token
  const handleGoogle = useGoogleLogin({
    onSuccess: async (tokenRes) => {
      setError('')
      const res = await googleLogin(tokenRes.access_token, role, 'access_token')
      if (res.success) navigate('/dashboard')
      else setError(res.message)
    },
    onError: () => setError('Google sign-in was cancelled or failed. Please try again.'),
  })

  const handleForgot = async e => {
    e.preventDefault()
    if (!fpEmail) { setError('Enter your email address.'); return }
    setFpMsg(`OTP sent to ${fpEmail}. Check your inbox.`)
    setError('')
  }

  const roleTab = (r) => ({
    flex: 1, padding: '9px', border: 'none', borderRadius: '7px',
    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
    background: role === r ? '#4f8ef7' : 'transparent',
    color: role === r ? '#fff' : '#7a8294', transition: 'all .18s',
  })

  return (
    <div style={S.page}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 800, color: '#eef0f4', textDecoration: 'none' }}>
            <span style={{ width: '32px', height: '32px', background: '#4f8ef7', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💪</span>
            GymPro
          </Link>
        </div>

        <div style={S.box}>
          <h1 style={S.title}>{forgotMode ? 'Reset password' : 'Welcome back'}</h1>
          <p style={S.sub}>{forgotMode ? 'Enter your email to receive a reset OTP' : 'Sign in to your GymPro account'}</p>

          {!forgotMode && (
            <div style={S.roleTabs}>
              <button style={roleTab('member')} onClick={() => { setRole('member'); setError('') }}>🏃 Member</button>
              <button style={roleTab('trainer')} onClick={() => { setRole('trainer'); setError('') }}>🧑‍🏫 Trainer</button>
            </div>
          )}

          {error && <div style={S.err}>{error}</div>}
          {fpMsg && <div style={S.ok}>{fpMsg}</div>}

          {forgotMode ? (
            <form onSubmit={handleForgot}>
              <button type="button" onClick={() => { setForgotMode(false); setFpMsg(''); setError('') }} style={{ background: 'none', border: 'none', color: '#4f8ef7', fontSize: '12px', cursor: 'pointer', marginBottom: '16px', padding: 0 }}>← Back to sign in</button>
              <div style={{ marginBottom: '14px' }}>
                <label style={S.label}>Email address</label>
                <input style={S.input} type="email" value={fpEmail} onChange={e => setFpEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <button type="submit" style={S.submit}>Send reset OTP</button>
            </form>
          ) : (
            <>
              <button onClick={() => handleGoogle()} disabled={loading} style={S.gBtn}>
                <GoogleSVG /> Continue with Google as {role === 'member' ? 'Member' : 'Trainer'}
              </button>

              <div style={S.divider}><div style={S.divLine} />or with email<div style={S.divLine} /></div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={S.label}>Email address</label>
                  <input style={S.input} name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleInput} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <label style={{ ...S.label, marginBottom: 0 }}>Password</label>
                    <button type="button" onClick={() => setForgotMode(true)} style={{ background: 'none', border: 'none', color: '#4f8ef7', fontSize: '12px', cursor: 'pointer', padding: 0 }}>Forgot password?</button>
                  </div>
                  <input style={S.input} name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleInput} />
                </div>
                <button type="submit" disabled={loading} style={{ ...S.submit, opacity: loading ? 0.6 : 1 }}>
                  {loading ? 'Signing in…' : `Sign in as ${role === 'member' ? 'Member' : 'Trainer'}`}
                </button>
              </form>

              <div style={S.toggle}>
                Don't have an account? <Link to="/register" style={{ color: '#4f8ef7', fontWeight: 600 }}>Sign up free</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
