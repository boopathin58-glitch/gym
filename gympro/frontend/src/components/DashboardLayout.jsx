import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children, activeTab, onTabChange, links, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d0f12', fontFamily: 'Inter, sans-serif', color: '#eef0f4' }}>
      {/* Top nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', height: '60px', background: '#13161a', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: 800 }}>
          <span style={{ width: '28px', height: '28px', background: '#4f8ef7', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>💪</span>
          GymPro
          <span style={{ fontSize: '12px', color: '#7a8294', fontWeight: 400, marginLeft: '6px' }}>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button style={{ background: 'none', border: 'none', color: '#7a8294', fontSize: '20px', cursor: 'pointer', position: 'relative' }}>🔔</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#4f8ef7' }}>
              {user?.avatar ? <img src={user.avatar} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} /> : user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: '11px', color: '#7a8294', textTransform: 'capitalize' }}>{user?.role}{user?.provider === 'google' ? ' · Google' : ''}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ padding: '7px 14px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.13)', background: 'none', color: '#eef0f4', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Sign out</button>
        </div>
      </nav>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        {/* Sidebar */}
        <aside style={{ width: '210px', background: '#13161a', borderRight: '1px solid rgba(255,255,255,0.07)', padding: '14px 10px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#4a5060', padding: '10px 10px 5px' }}>Navigation</div>
          {links.map(l => (
            <button key={l.id} onClick={() => onTabChange(l.id)} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 11px', borderRadius: '8px', border: activeTab === l.id ? '1px solid rgba(79,142,247,0.25)' : '1px solid transparent', background: activeTab === l.id ? 'rgba(79,142,247,0.1)' : 'none', color: activeTab === l.id ? '#4f8ef7' : '#7a8294', fontSize: '13px', fontWeight: activeTab === l.id ? 600 : 500, cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all .15s' }}>
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{l.icon}</span>{l.label}
            </button>
          ))}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '8px 0' }} />
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 11px', borderRadius: '8px', border: '1px solid transparent', background: 'none', color: '#7a8294', fontSize: '13px', fontWeight: 500, cursor: 'pointer', width: '100%', textAlign: 'left' }}>
            <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>🚪</span>Sign out
          </button>
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
