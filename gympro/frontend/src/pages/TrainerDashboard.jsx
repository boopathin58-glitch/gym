import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const LINKS = [
  { id: 'overview', icon: '🏠', label: 'Overview' },
  { id: 'clients', icon: '👥', label: 'My Clients' },
  { id: 'schedule', icon: '📅', label: 'Schedule' },
  { id: 'earnings', icon: '💰', label: 'Earnings' },
  { id: 'classes', icon: '🏋️', label: 'Classes' },
  { id: 'profile', icon: '👤', label: 'Profile' },
];

const mc = { background: '#13161a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '18px' };
const card = { background: '#13161a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' };
const badge = (color) => ({ padding: '3px 9px', borderRadius: '100px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', ...{
  green: { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' },
  yellow: { background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' },
  blue: { background: 'rgba(79,142,247,0.1)', color: '#4f8ef7', border: '1px solid rgba(79,142,247,0.25)' },
  red: { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' },
  purple: { background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.25)' },
}[color] });

export default function TrainerDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');

  return (
    <DashboardLayout activeTab={tab} onTabChange={setTab} links={LINKS} title="Trainer Portal">
      {tab === 'overview' && <Overview user={user} mc={mc} card={card} badge={badge} onNav={setTab} />}
      {tab === 'clients' && <Clients card={card} badge={badge} />}
      {tab === 'schedule' && <Schedule card={card} badge={badge} />}
      {tab === 'earnings' && <Earnings mc={mc} card={card} badge={badge} />}
      {tab === 'classes' && <Classes card={card} badge={badge} />}
      {tab === 'profile' && <ProfileTab user={user} />}
    </DashboardLayout>
  );
}

function Overview({ user, mc, card, badge, onNav }) {
  const name = user?.name?.split(' ')[0] || 'there';
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div><div style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-.5px', marginBottom: '4px' }}>Good morning, {name} 🧑‍🏫</div><div style={{ color: '#7a8294', fontSize: '14px' }}>3 sessions today · 18 active clients</div></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onNav('schedule')} style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.13)', background: 'none', color: '#eef0f4', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>📅 View schedule</button>
          <button onClick={() => onNav('clients')} style={{ padding: '8px 15px', borderRadius: '8px', border: 'none', background: '#4f8ef7', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>➕ Add client</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '12px', marginBottom: '18px' }}>
        {[['Active clients','18','↑ 2 new this week','#22c55e'],['Sessions this week','11','40 hrs billed','#7a8294'],['Avg. rating','4.9 ★','84 reviews','#7a8294'],['Revenue (June)','₹42K','↑ 12% vs last month','#22c55e']].map(([l,v,s,c])=>(
          <div key={l} style={mc}><div style={{ fontSize: '10px', color: '#7a8294', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px', fontWeight: 600 }}>{l}</div><div style={{ fontSize: '30px', fontWeight: 900, letterSpacing: '-1.5px' }}>{v}</div><div style={{ fontSize: '11px', color: c, marginTop: '5px' }}>{s}</div></div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div style={card}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 700, fontSize: '13px' }}>Today's sessions</span><span style={{ fontSize: '11px', color: '#4f8ef7', cursor: 'pointer' }} onClick={() => onNav('schedule')}>Full schedule</span></div>
          {[['1-on-1 · Rahul K.','6:00 AM · Strength · 60 min','green','Confirmed'],['Group HIIT (8 members)','8:00 AM · Cardio · 45 min','green','Confirmed'],['1-on-1 · Divya S.','5:30 PM · Weight loss · 60 min','yellow','Pending']].map(([n,d,c,s])=>(
            <div key={n} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontSize: '13px', fontWeight: 500 }}>{n}</div><div style={{ fontSize: '11px', color: '#7a8294' }}>{d}</div></div><span style={badge(c)}>{s}</span></div>
          ))}
        </div>
        <div style={card}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 700, fontSize: '13px' }}>Client goal progress</span><span style={{ fontSize: '11px', color: '#4f8ef7', cursor: 'pointer' }} onClick={() => onNav('clients')}>All clients</span></div>
          {[['Rahul K. — Fat loss',72],['Divya S. — Strength',55],['Arjun M. — Endurance',88],['Kavya R. — Flexibility',40]].map(([l,p])=>(
            <div key={l} style={{ padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '7px', fontWeight: 500 }}><span>{l}</span><span style={{ color: '#7a8294' }}>{p}%</span></div>
              <div style={{ height: '5px', background: '#22272f', borderRadius: '100px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${p}%`, background: '#4f8ef7', borderRadius: '100px' }}></div></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }}>
        <div style={card}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '13px', fontWeight: 700 }}>Recent client activity</div>
          {[['Rahul K. checked in','Today 6:00 AM','green'],['Priya M. missed session','Yesterday 7:30 AM','red'],['Arjun M. plan completed','Yesterday 9:00 AM','purple']].map(([n,d,c])=>(
            <div key={n} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontSize: '13px', fontWeight: 500 }}>{n}</div><div style={{ fontSize: '11px', color: '#7a8294' }}>{d}</div></div><span style={badge(c)}>{c==='green'?'Active':c==='red'?'Missed':'Done'}</span></div>
          ))}
        </div>
        <div style={card}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 700, fontSize: '13px' }}>Earnings breakdown</span><span style={{ fontSize: '11px', color: '#4f8ef7', cursor: 'pointer' }} onClick={() => onNav('earnings')}>Full report</span></div>
          {[['Personal training','₹28,000'],['Group classes','₹9,600'],['Online programmes','₹4,400']].map(([l,v])=>(
            <div key={l} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span style={{ color: '#7a8294' }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span></div>
          ))}
          <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, borderTop: '1px solid rgba(255,255,255,0.13)' }}><span>Total (June)</span><span style={{ color: '#4f8ef7', fontSize: '16px' }}>₹42,000</span></div>
        </div>
      </div>
    </>
  );
}

function Clients({ card, badge }) {
  const clients = [
    {n:'Rahul Kumar',g:'Fat loss',prog:72,s:'Active',plan:'Pro'},
    {n:'Divya Sharma',g:'Strength',prog:55,s:'Active',plan:'Elite'},
    {n:'Arjun Menon',g:'Endurance',prog:88,s:'Active',plan:'Pro'},
    {n:'Kavya Reddy',g:'Flexibility',prog:40,s:'Active',plan:'Starter'},
    {n:'Vikram Iyer',g:'Muscle gain',prog:63,s:'Active',plan:'Pro'},
    {n:'Priya Nair',g:'Weight loss',prog:30,s:'Inactive',plan:'Starter'},
  ];
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div><div style={{ fontSize: '24px', fontWeight: 900 }}>My Clients 👥</div><div style={{ color: '#7a8294', fontSize: '14px', marginTop: '4px' }}>18 active clients this month</div></div>
        <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#4f8ef7', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ Add client</button>
      </div>
      <div style={card}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '13px', fontWeight: 700 }}>All clients</div>
        {clients.map(c => (
          <div key={c.n} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#22272f', border: '1px solid rgba(255,255,255,0.13)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#7a8294', flexShrink: 0 }}>{c.n[0]}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{c.n}</div><div style={{ fontSize: '11px', color: '#7a8294' }}>Goal: {c.g} · {c.plan} plan</div></div>
            <div style={{ width: '90px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}><span>Progress</span><span>{c.prog}%</span></div>
              <div style={{ height: '4px', background: '#22272f', borderRadius: '100px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${c.prog}%`, background: '#4f8ef7', borderRadius: '100px' }}></div></div>
            </div>
            <span style={badge(c.s === 'Active' ? 'green' : 'red')}>{c.s}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function Schedule({ card, badge }) {
  const sessions = [
    ['Monday','Rahul Kumar','1-on-1 PT','6:00 AM','60 min','green','Confirmed'],
    ['Monday','Group HIIT (8)','Group class','8:00 AM','45 min','green','Confirmed'],
    ['Tuesday','Arjun Menon','1-on-1 PT','7:30 AM','60 min','green','Confirmed'],
    ['Wednesday','Kavya Reddy','Flexibility','9:00 AM','45 min','yellow','Pending'],
    ['Thursday','Divya Sharma','1-on-1 PT','6:30 AM','60 min','green','Confirmed'],
    ['Friday','Group Strength (6)','Group class','7:00 AM','60 min','blue','Scheduled'],
    ['Friday','Vikram Iyer','1-on-1 PT','5:30 PM','60 min','green','Confirmed'],
  ];
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div><div style={{ fontSize: '24px', fontWeight: 900 }}>Schedule 📅</div><div style={{ color: '#7a8294', fontSize: '14px', marginTop: '4px' }}>Upcoming sessions this week</div></div>
        <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#4f8ef7', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ Add session</button>
      </div>
      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Day','Client / Group','Type','Time','Duration','Status'].map(h=><th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#7a8294', borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#1a1e24' }}>{h}</th>)}</tr></thead>
          <tbody>{sessions.map(([d,c,t,ti,du,col,s])=>(
            <tr key={c+ti}>{[d,<b>{c}</b>,t,ti,du,<span style={badge(col)}>{s}</span>].map((v,i)=><td key={i} style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{v}</td>)}</tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}

function Earnings({ mc, card, badge }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div><div style={{ fontSize: '24px', fontWeight: 900 }}>Earnings 💰</div><div style={{ color: '#7a8294', fontSize: '14px', marginTop: '4px' }}>June 2026 revenue breakdown</div></div>
        <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.13)', background: 'none', color: '#eef0f4', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Download report</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '12px', marginBottom: '18px' }}>
        {[['Total (June)','₹42,000','↑ 12% vs May','#22c55e'],['PT sessions','₹28,000','28 sessions','#7a8294'],['Group classes','₹9,600','16 classes','#7a8294'],['Online programmes','₹4,400','4 sold','#7a8294']].map(([l,v,s,c])=>(
          <div key={l} style={mc}><div style={{ fontSize: '10px', color: '#7a8294', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px', fontWeight: 600 }}>{l}</div><div style={{ fontSize: '24px', fontWeight: 900 }}>{v}</div><div style={{ fontSize: '11px', color: c, marginTop: '4px' }}>{s}</div></div>
        ))}
      </div>
      <div style={card}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '13px', fontWeight: 700 }}>Transaction history</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Date','Client','Service','Amount','Status'].map(h=><th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#7a8294', borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#1a1e24' }}>{h}</th>)}</tr></thead>
          <tbody>{[['Jun 26','Rahul Kumar','PT Session (4×)','₹4,000','Paid'],['Jun 24','Divya Sharma','PT Session (4×)','₹4,000','Paid'],['Jun 22','Group HIIT','Group class × 8','₹2,400','Paid'],['Jun 20','Arjun Menon','PT Session (4×)','₹4,000','Paid'],['Jun 18','Vikram Iyer','Elite Programme','₹8,000','Paid'],['Jun 15','Group Strength','Group class × 6','₹1,800','Pending']].map(([d,c,s,a,st])=>(
            <tr key={d+c}>{[d,c,s,<b>{a}</b>,<span style={badge(st==='Paid'?'green':'yellow')}>{st}</span>].map((v,i)=><td key={i} style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{v}</td>)}</tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}

function Classes({ card, badge }) {
  const classes = [['HIIT Blast','Cardio','Mon 7:00 AM',8,12,'Scheduled','green'],['Power Yoga','Yoga','Tue 9:00 AM',15,20,'Scheduled','green'],['Strength Fundamentals','Strength','Wed 6:30 AM',6,10,'Scheduled','green'],['Core & Flex','Pilates','Thu 8:00 AM',12,15,'Scheduled','green'],['Cardio Kickboxing','Boxing','Fri 7:00 AM',10,12,'Scheduled','green'],['Weekend Bootcamp','HIIT','Sat 8:00 AM',20,20,'Full','red']];
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <div><div style={{ fontSize: '24px', fontWeight: 900 }}>Classes 🏋️</div><div style={{ color: '#7a8294', fontSize: '14px', marginTop: '4px' }}>Manage your group classes</div></div>
        <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#4f8ef7', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ Create class</button>
      </div>
      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Class','Category','Date & Time','Enrolled','Capacity','Status'].map(h=><th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#7a8294', borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#1a1e24' }}>{h}</th>)}</tr></thead>
          <tbody>{classes.map(([n,c,t,e,cap,s,col])=>(
            <tr key={n}>{[<b>{n}</b>,<span style={badge('purple')}>{c}</span>,t,e,cap,<span style={badge(col)}>{s}</span>].map((v,i)=><td key={i} style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{v}</td>)}</tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}

function ProfileTab({ user }) {
  const inp = { width: '100%', padding: '10px 12px', background: '#1a1e24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', color: '#eef0f4', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
  return (
    <>
      <div style={{ fontSize: '24px', fontWeight: 900, marginBottom: '6px' }}>Profile 👤</div>
      <div style={{ color: '#7a8294', fontSize: '14px', marginBottom: '22px' }}>Manage your trainer account</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div style={{ background: '#13161a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '13px', fontWeight: 700 }}>Personal info</div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div><div style={{ fontSize: '12px', fontWeight: 600, color: '#7a8294', marginBottom: '5px' }}>Full name</div><input style={inp} defaultValue={user?.name} /></div>
            <div><div style={{ fontSize: '12px', fontWeight: 600, color: '#7a8294', marginBottom: '5px' }}>Email</div><input style={inp} defaultValue={user?.email} disabled={user?.provider === 'google'} /></div>
            <div><div style={{ fontSize: '12px', fontWeight: 600, color: '#7a8294', marginBottom: '5px' }}>Specialty</div><input style={inp} defaultValue={user?.specialty || 'Strength & Conditioning'} /></div>
            <div><div style={{ fontSize: '12px', fontWeight: 600, color: '#7a8294', marginBottom: '5px' }}>Bio</div><textarea style={{ ...inp, height: '80px', resize: 'vertical' }} placeholder="Tell clients about yourself…" /></div>
            {user?.provider === 'google' && <div style={{ padding: '8px 12px', background: 'rgba(79,142,247,0.07)', border: '1px solid rgba(79,142,247,0.25)', borderRadius: '8px', fontSize: '12px', color: '#4f8ef7' }}>🔗 Signed in with Google</div>}
            <button style={{ padding: '11px', background: '#4f8ef7', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Save changes</button>
          </div>
        </div>
        <div style={{ background: '#13161a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '13px', fontWeight: 700 }}>Trainer stats</div>
          {[['Rating','4.9 ★'],['Total reviews','84'],['Active clients','18'],['Sessions (all time)','340'],['Revenue (all time)','₹4,20,000']].map(([l,v])=>(
            <div key={l} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span style={{ color: '#7a8294' }}>{l}</span><b>{v}</b></div>
          ))}
        </div>
      </div>
    </>
  );
}
