import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#0d0f12', fontFamily: 'Inter, sans-serif', color: '#eef0f4' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', height: '60px', background: '#13161a', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: 800 }}>
          <span style={{ width: '28px', height: '28px', background: '#4f8ef7', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>💪</span>GymPro
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => navigate('/login')} style={{ padding: '7px 16px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.13)', background: 'none', color: '#eef0f4', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Log in</button>
          <button onClick={() => navigate('/register')} style={{ padding: '7px 17px', borderRadius: '7px', border: 'none', background: '#4f8ef7', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Start free trial</button>
        </div>
      </nav>
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px', minHeight: '88vh', background: 'radial-gradient(ellipse 900px 500px at 50% -100px,rgba(79,142,247,0.12) 0%,transparent 70%)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '100px', border: '1px solid rgba(79,142,247,0.3)', background: 'rgba(79,142,247,0.08)', color: '#4f8ef7', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '28px' }}>💪 Gym management platform</div>
        <h1 style={{ fontSize: 'clamp(42px,7.5vw,78px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-3px', marginBottom: '20px', maxWidth: '720px' }}>Manage your gym.<br /><span style={{ color: '#4f8ef7' }}>Grow your members.</span></h1>
        <p style={{ fontSize: '16px', color: '#7a8294', maxWidth: '480px', lineHeight: 1.7, marginBottom: '36px' }}>Member CRM, class scheduling, billing, check-ins, trainer tools and analytics — all in one platform built for modern fitness businesses.</p>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '60px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => navigate('/register')} style={{ padding: '14px 32px', borderRadius: '10px', border: 'none', background: '#4f8ef7', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>Start free trial →</button>
          <button onClick={() => navigate('/login')} style={{ padding: '14px 32px', borderRadius: '10px', background: 'none', color: '#eef0f4', border: '1px solid rgba(255,255,255,0.13)', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>Sign in to dashboard</button>
        </div>
        <div style={{ display: 'flex', gap: '0', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', background: '#13161a', flexWrap: 'wrap' }}>
          {[['2,400+','Active members'],['38','Expert trainers'],['120+','Weekly classes'],['4.9 ★','Avg. rating']].map(([n,l])=>(
            <div key={l} style={{ flex: '1 1 120px', textAlign: 'center', padding: '22px 24px', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-1.5px' }}>{n}</div>
              <div style={{ fontSize: '11px', color: '#7a8294', marginTop: '3px' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
