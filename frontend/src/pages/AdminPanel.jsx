import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { summaryAPI } from '../services/api'
import { Users, FileText, Star, TrendingUp, Loader } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: accent ? 'var(--accent-soft)' : 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${accent ? 'rgba(124,110,247,0.2)' : 'var(--border)'}`, flexShrink: 0 }}>
        <Icon size={20} color={accent ? 'var(--accent)' : 'var(--text-muted)'} />
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.5px', lineHeight: 1 }}>{value ?? '—'}</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontSize: 13 }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ color: 'var(--accent)', fontWeight: 500 }}>{payload[0].value} {payload[0].name}</div>
    </div>
  )
}

export default function AdminPanel() {
  const [analytics, setAnalytics] = useState(null)
  const [summaries, setSummaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    Promise.all([summaryAPI.getAnalytics(), summaryAPI.getAll()])
      .then(([aRes, sRes]) => { setAnalytics(aRes.data); setSummaries(sRes.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const chartData = analytics?.recentUploads?.slice().reverse().map(r => ({
    date: new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    uploads: parseInt(r.count)
  }))

  const signupData = analytics?.recentSignups?.slice().reverse().map(r => ({
    date: new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    signups: parseInt(r.count)
  }))

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="page-wrapper" style={{ padding: '48px 24px' }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.4px', marginBottom: 6 }}>Admin panel</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Platform overview and user activity.</p>
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 32, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
          {['overview', 'summaries'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: 'none', border: 'none', padding: '10px 16px',
              fontSize: 14, fontWeight: 500, cursor: 'pointer',
              color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all 0.15s', textTransform: 'capitalize',
            }}>{t}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <Loader size={24} color="var(--text-muted)" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : tab === 'overview' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <StatCard icon={Users} label="Total users" value={analytics?.totalUsers} accent />
              <StatCard icon={FileText} label="Total summaries" value={analytics?.totalSummaries} accent />
              <StatCard icon={TrendingUp} label="Uploads today" value={analytics?.todayUploads} />
              <StatCard icon={Star} label="Avg rating" value={analytics?.avgRating ?? '—'} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
              <div className="card">
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 20, color: 'var(--text-secondary)' }}>Uploads — last 7 days</div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="uploads" stroke="var(--accent)" strokeWidth={2} dot={{ fill: 'var(--accent)', r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 20, color: 'var(--text-secondary)' }}>Signups — last 7 days</div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={signupData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="signups" stroke="#4ade80" strokeWidth={2} dot={{ fill: '#4ade80', r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {summaries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)', fontSize: 14 }}>No summaries yet.</div>
            ) : summaries.map(s => (
              <div key={s.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <FileText size={15} color="var(--text-muted)" />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{s.file_name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.user_name} · {s.user_email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {s.rating && <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-muted)' }}><Star size={13} fill="var(--accent)" color="var(--accent)" />{s.rating}</div>}
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(s.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
