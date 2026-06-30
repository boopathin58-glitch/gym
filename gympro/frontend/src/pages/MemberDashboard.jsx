import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const LINKS = [
  { id: 'overview', icon: '🏠', label: 'Overview' },
  { id: 'classes', icon: '📅', label: 'My Classes' },
  { id: 'workout', icon: '💪', label: 'Workout Plan' },
  { id: 'progress', icon: '📊', label: 'Progress' },
  { id: 'membership', icon: '💳', label: 'Membership' },
  { id: 'profile', icon: '👤', label: 'Profile' },
];

const mc = { background: '#13161a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '18px' };
const card = { background: '#13161a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' };
const badge = (color) => ({ padding: '3px 9px', borderRadius: '100px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', ...{
  green: { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' },
  yellow: { background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' },
  blue: { background: 'rgba(79,142,247,0.1)', color: '#4f8ef7', border: '1px solid rgba(79,142,247,0.25)' },
}[color] });

export default function MemberDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    API.get('/users/dashboard/member').then(r => setDashboard(r.data.dashboard)).catch(() => {});
  }, []);

  return (
    <DashboardLayout activeTab={tab} onTabChange={setTab} links={LINKS} title="Member Portal">
      {tab === 'overview' && <Overview user={user} dashboard={dashboard} mc={mc} card={card} badge={badge} onNav={setTab} />}
      {tab === 'classes' && <Classes card={card} badge={badge} />}
      {tab === 'workout' && <Workout card={card} badge={badge} />}
      {tab === 'progress' && <Progress mc={mc} card={card} />}
      {tab === 'membership' && <Membership mc={mc} badge={badge} onNav={setTab} />}
      {tab === 'profile' && <Profile user={user} />}
    </DashboardLayout>
  );
}

function Overview({ user, dashboard, mc, card, badge, onNav }) {
  const firstName = user?.name?.split(' ')[0] || 'there';
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div><div style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-.5px', marginBottom: '4px' }}>Good morning, {firstName} 👋</div><div style={{ color: '#7a8294', fontSize: '14px' }}>You're on a 7-day streak — keep pushing!</div></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onNav('classes')} style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.13)', background: 'none', color: '#eef0f4', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>📅 Book a class</button>
          <button onClick={() => onNav('workout')} style={{ padding: '8px 15px', borderRadius: '8px', border: 'none', background: '#4f8ef7', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>⚡ Start workout</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '12px', marginBottom: '18px' }}>
        {[['Workouts this month','14','↑ 3 from last month','#22c55e'],['Calories burned','9,240','this month','#7a8294'],['Active streak','7 days','↑ PB: 21 days','#22c55e'],['Classes booked','6','2 this week','#7a8294']].map(([l,v,s,c])=>(
          <div key={l} style={mc}><div style={{ fontSize: '10px', color: '#7a8294', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px', fontWeight: 600 }}>{l}</div><div style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-1.5px' }}>{v}</div><div style={{ fontSize: '11px', color: c, marginTop: '5px' }}>{s}</div></div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div style={card}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '13px', fontWeight: 700 }}>Upcoming classes</span><span style={{ fontSize: '11px', color: '#4f8ef7', cursor: 'pointer' }} onClick={() => onNav('classes')}>View all</span></div>
          {[['HIIT Blast','Mon 7:00 AM · Priya R.','green'],['Power Lifting','Wed 6:30 AM · Alex M.','green'],['Yoga Flow','Fri 8:00 AM · Meena S.','yellow']].map(([n,d,c])=>(
            <div key={n} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontSize: '13px', fontWeight: 500 }}>{n}</div><div style={{ fontSize: '11px', color: '#7a8294' }}>{d}</div></div><span style={badge(c)}>{c === 'green' ? 'Confirmed' : 'Waitlist'}</span></div>
          ))}
        </div>
        <div style={card}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '13px', fontWeight: 700 }}>Goal progress</span><span style={{ fontSize: '11px', color: '#4f8ef7', cursor: 'pointer' }}>Edit goals</span></div>
          {[['Weight loss',68],['Cardio fitness',82],['Strength',45],['Flexibility',60]].map(([l,p])=>(
            <div key={l} style={{ padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '7px', fontWeight: 500 }}><span>{l}</span><span style={{ color: '#7a8294' }}>{p}%</span></div>
              <div style={{ height: '5px', background: '#22272f', borderRadius: '100px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${p}%`, background: '#4f8ef7', borderRadius: '100px' }}></div></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Classes({ card, badge }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div><div style={{ fontSize: '24px', fontWeight: 900 }}>My Classes 📅</div><div style={{ color: '#7a8294', fontSize: '14px', marginTop: '4px' }}>Upcoming and booked sessions</div></div>
        <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#4f8ef7', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ Book new class</button>
      </div>
      <div style={card}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '13px', fontWeight: 700 }}>All enrolled classes</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Class','Trainer','Date & Time','Duration','Status'].map(h=><th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#7a8294', borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#1a1e24' }}>{h}</th>)}</tr></thead>
          <tbody>
            {[['HIIT Blast','Priya Rajendran','Mon Jun 30, 7:00 AM','45 min','green','Confirmed'],['Power Lifting','Alex Menon','Wed Jul 2, 6:30 AM','60 min','green','Confirmed'],['Yoga Flow','Meena Sharma','Fri Jul 4, 8:00 AM','60 min','yellow','Waitlist'],['Cardio Blast','Rahul Iyer','Sat Jul 5, 9:00 AM','30 min','blue','Booked']].map(([n,t,d,dur,c,s])=>(
              <tr key={n}>{[<b>{n}</b>,t,d,dur,<span style={badge(c)}>{s}</span>].map((v,i)=><td key={i} style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{v}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Workout({ card, badge }) {
  const days = [
    { day: 'Monday', focus: 'Chest & Triceps', ex: ['Bench Press 4×10','Push-ups 3×15','Tricep Dips 3×12','Cable Fly 3×12'] },
    { day: 'Tuesday', focus: 'Back & Biceps', ex: ['Pull-ups 4×8','Bent Over Row 4×10','Bicep Curl 3×12','Lat Pulldown 3×10'] },
    { day: 'Wednesday', focus: 'Legs', ex: ['Squat 4×10','Leg Press 4×12','Lunges 3×12','Calf Raises 4×15'] },
    { day: 'Thursday', focus: 'Shoulders', ex: ['OHP 4×10','Lateral Raises 3×15','Arnold Press 3×12','Face Pulls 3×15'] },
    { day: 'Friday', focus: 'Core & Cardio', ex: ['Plank 3×60s','Russian Twist 3×20','HIIT 20 min','Cool down'] },
  ];
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div><div style={{ fontSize: '24px', fontWeight: 900 }}>Workout Plan 💪</div><div style={{ color: '#7a8294', fontSize: '14px', marginTop: '4px' }}>Your weekly training schedule</div></div>
        <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#4f8ef7', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ Log workout</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '14px' }}>
        {days.map(({ day, focus, ex }) => (
          <div key={day} style={card}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '13px', fontWeight: 700 }}>{day}</span><span style={badge('blue')}>{focus}</span></div>
            {ex.map(e => <div key={e} style={{ padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px' }}>{e}</div>)}
          </div>
        ))}
        <div style={{ ...card, border: '1px dashed rgba(255,255,255,0.13)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '32px', color: '#7a8294' }}>
          <div style={{ fontSize: '32px' }}>🧘</div><div style={{ fontWeight: 600 }}>Sat & Sun</div><div style={{ fontSize: '12px' }}>Rest & Recovery</div>
        </div>
      </div>
    </>
  );
}

function Progress({ mc, card }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div><div style={{ fontSize: '24px', fontWeight: 900 }}>Progress 📊</div><div style={{ color: '#7a8294', fontSize: '14px', marginTop: '4px' }}>Track your fitness journey</div></div>
        <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#4f8ef7', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ Log today</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '12px', marginBottom: '18px' }}>
        {[['Current weight','72 kg','↓ 3 kg lost','#22c55e'],['Body fat %','18%','↓ 2% reduced','#22c55e'],['Muscle mass','34 kg','↑ 1.5 kg gained','#22c55e'],['Total workouts','48','all time','#7a8294']].map(([l,v,s,c])=>(
          <div key={l} style={mc}><div style={{ fontSize: '10px', color: '#7a8294', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px', fontWeight: 600 }}>{l}</div><div style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-1.5px' }}>{v}</div><div style={{ fontSize: '11px', color: c, marginTop: '5px' }}>{s}</div></div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div style={card}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '13px', fontWeight: 700 }}>Body measurements</div>
          {[['Chest','96 cm'],['Waist','82 cm'],['Hips','94 cm'],['Arms','35 cm'],['Legs','54 cm']].map(([l,v])=>(
            <div key={l} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>{l}</span><b>{v}</b></div>
          ))}
        </div>
        <div style={card}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '13px', fontWeight: 700 }}>Monthly summary</div>
          {[['Workouts completed','14 sessions'],['Calories burned','9,240 kcal'],['Active minutes','840 min'],['Avg. session','60 min']].map(([l,v])=>(
            <div key={l} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span style={{ color: '#7a8294' }}>{l}</span><b style={{ color: '#4f8ef7' }}>{v}</b></div>
          ))}
        </div>
      </div>
    </>
  );
}

function Membership({ mc, badge, onNav }) {
  return (
    <>
      <div style={{ fontSize: '24px', fontWeight: 900, marginBottom: '6px' }}>Membership 💳</div>
      <div style={{ color: '#7a8294', fontSize: '14px', marginBottom: '22px' }}>Manage your subscription</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '12px', marginBottom: '24px' }}>
        {[['Current plan','Pro','',''],['Monthly amount','₹2,499','auto-renewed',''],['Next billing','Jul 1, 2026','',''],['Member since','Jan 2026','6 months','']].map(([l,v,s])=>(
          <div key={l} style={mc}><div style={{ fontSize: '10px', color: '#7a8294', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px', fontWeight: 600 }}>{l}</div><div style={{ fontSize: '24px', fontWeight: 900 }}>{v}</div>{s && <div style={{ fontSize: '11px', color: '#7a8294', marginTop: '4px' }}>{s}</div>}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '14px' }}>
        {[{name:'Starter',price:'₹999',features:['Up to 3 classes/week','Basic tracking','Locker access'],current:false},
          {name:'Pro',price:'₹2,499',features:['Unlimited classes','1 PT session/month','Nutrition guide','Full analytics'],current:true},
          {name:'Elite',price:'₹3,999',features:['4 PT sessions/month','Diet plan','Guest passes','Priority booking'],current:false}].map(p=>(
          <div key={p.name} style={{ background: p.current ? 'rgba(79,142,247,0.07)' : '#13161a', border: `1px solid ${p.current ? 'rgba(79,142,247,0.4)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '14px', padding: '24px', position: 'relative' }}>
            {p.current && <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: '#4f8ef7', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '3px 13px', borderRadius: '100px', whiteSpace: 'nowrap' }}>CURRENT PLAN</div>}
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#7a8294', marginBottom: '6px' }}>{p.name}</div>
            <div style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-2px' }}>{p.price}</div>
            <div style={{ color: '#7a8294', fontSize: '12px', marginBottom: '16px' }}>/ month</div>
            <ul style={{ listStyle: 'none', marginBottom: '20px' }}>{p.features.map(f=><li key={f} style={{ fontSize: '13px', color: '#c0c8d8', padding: '4px 0', display: 'flex', gap: '8px', alignItems: 'flex-start' }}><span style={{ color: '#4f8ef7', fontWeight: 800 }}>✓</span>{f}</li>)}</ul>
            <button disabled={p.current} style={{ width: '100%', padding: '11px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: p.current ? 'not-allowed' : 'pointer', background: p.current ? '#4f8ef7' : 'none', color: p.current ? '#fff' : '#eef0f4', border: p.current ? 'none' : '1px solid rgba(255,255,255,0.13)', opacity: p.current ? 0.7 : 1 }}>{p.current ? 'Current plan' : p.name === 'Elite' ? 'Upgrade' : 'Downgrade'}</button>
          </div>
        ))}
      </div>
    </>
  );
}

function Profile({ user }) {
  const inp = { width: '100%', padding: '10px 12px', background: '#1a1e24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', color: '#eef0f4', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
  return (
    <>
      <div style={{ fontSize: '24px', fontWeight: 900, marginBottom: '6px' }}>Profile 👤</div>
      <div style={{ color: '#7a8294', fontSize: '14px', marginBottom: '22px' }}>Manage your account details</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div style={{ background: '#13161a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '13px', fontWeight: 700 }}>Personal info</div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div><div style={{ fontSize: '12px', fontWeight: 600, color: '#7a8294', marginBottom: '5px' }}>Full name</div><input style={inp} defaultValue={user?.name} /></div>
            <div><div style={{ fontSize: '12px', fontWeight: 600, color: '#7a8294', marginBottom: '5px' }}>Email</div><input style={inp} defaultValue={user?.email} disabled={user?.provider === 'google'} /></div>
            <div><div style={{ fontSize: '12px', fontWeight: 600, color: '#7a8294', marginBottom: '5px' }}>Phone</div><input style={inp} placeholder="+91 98765 43210" /></div>
            <div><div style={{ fontSize: '12px', fontWeight: 600, color: '#7a8294', marginBottom: '5px' }}>Fitness goal</div><select style={inp}><option>General Fitness</option><option>Weight Loss</option><option>Muscle Gain</option></select></div>
            {user?.provider === 'google' && <div style={{ padding: '8px 12px', background: 'rgba(79,142,247,0.07)', border: '1px solid rgba(79,142,247,0.25)', borderRadius: '8px', fontSize: '12px', color: '#4f8ef7' }}>🔗 Signed in with Google</div>}
            <button style={{ padding: '11px', background: '#4f8ef7', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Save changes</button>
          </div>
        </div>
        <div style={{ background: '#13161a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '13px', fontWeight: 700 }}>Security</div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {user?.provider !== 'google' ? <>
              <div><div style={{ fontSize: '12px', fontWeight: 600, color: '#7a8294', marginBottom: '5px' }}>Current password</div><input style={inp} type="password" placeholder="••••••••" /></div>
              <div><div style={{ fontSize: '12px', fontWeight: 600, color: '#7a8294', marginBottom: '5px' }}>New password</div><input style={inp} type="password" placeholder="New password" /></div>
              <div><div style={{ fontSize: '12px', fontWeight: 600, color: '#7a8294', marginBottom: '5px' }}>Confirm new password</div><input style={inp} type="password" placeholder="Confirm" /></div>
              <button style={{ padding: '11px', background: '#4f8ef7', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Update password</button>
            </> : <div style={{ color: '#7a8294', fontSize: '13px', padding: '8px 0', lineHeight: 1.6 }}>Password is managed by Google. Visit your Google account settings to change it.</div>}
          </div>
        </div>
      </div>
    </>
  );
}
