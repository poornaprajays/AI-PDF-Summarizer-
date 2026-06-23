import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { summaryAPI } from '../services/api'
import { Users, FileText, Star, TrendingUp, Loader } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#FFFFFF', border: '4px solid #121212', borderRadius: 0, boxShadow: '4px 4px 0px 0px #121212' }}>
      <div style={{ 
        width: 48, 
        height: 48, 
        background: color || '#EAEAEA', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        border: '3px solid #121212', 
        boxShadow: '2px 2px 0px 0px #121212',
        flexShrink: 0 
      }}>
        <Icon size={20} color="#121212" />
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1, color: '#121212' }}>{value ?? '—'}</div>
        <div style={{ fontSize: 11, fontWeight: 900, color: '#7A7A7A', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{label}</div>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ 
      background: '#FFFFFF', 
      border: '3px solid #121212', 
      padding: '8px 12px', 
      fontSize: 12,
      fontWeight: 700,
      textTransform: 'uppercase'
    }}>
      <div style={{ color: '#7A7A7A', marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#D02020', fontWeight: 900 }}>{payload[0].value} {payload[0].name}</div>
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F0F0F0' }}>
      <Navbar />
      <div className="page-wrapper" style={{ padding: '48px 48px', flexGrow: 1 }}>
        
        {/* Header Block */}
        <div style={{ 
          background: '#FFFFFF', 
          border: '4px solid #121212', 
          padding: '24px 32px', 
          marginBottom: 40,
          boxShadow: '6px 6px 0px 0px #121212',
          position: 'relative'
        }}>
          {/* Bauhaus colorful tags on top right */}
          <div style={{ position: 'absolute', top: 0, right: 32, display: 'flex' }}>
            <div style={{ width: 24, height: 16, background: '#D02020', borderLeft: '4px solid #121212', borderBottom: '4px solid #121212' }} />
            <div style={{ width: 24, height: 16, background: '#1040C0', borderLeft: '4px solid #121212', borderBottom: '4px solid #121212' }} />
            <div style={{ width: 24, height: 16, background: '#F0C020', borderLeft: '4px solid #121212', borderBottom: '4px solid #121212', borderRight: '4px solid #121212' }} />
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1.5px', color: '#121212', textTransform: 'uppercase', margin: 0, marginBottom: 8 }}>
            ADMIN CONTROL PANEL
          </h1>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#4E4E4E', textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0 }}>
            Platform overview and user activity metrics logs.
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', border: '4px solid #121212', marginBottom: 32, boxShadow: '4px 4px 0px 0px #121212' }}>
          <button 
            onClick={() => setTab('overview')} 
            style={{ 
              flex: 1,
              background: tab === 'overview' ? '#1040C0' : '#FFFFFF', 
              color: tab === 'overview' ? '#FFFFFF' : '#121212', 
              border: 'none',
              borderRight: '4px solid #121212',
              padding: '16px', 
              fontWeight: 900,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'all 0.1s'
            }}
          >
            SYSTEM OVERVIEW
          </button>
          <button 
            onClick={() => setTab('summaries')} 
            style={{ 
              flex: 1,
              background: tab === 'summaries' ? '#1040C0' : '#FFFFFF', 
              color: tab === 'summaries' ? '#FFFFFF' : '#121212', 
              border: 'none',
              padding: '16px', 
              fontWeight: 900,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'all 0.1s'
            }}
          >
            ALL SUMMARIES {summaries.length > 0 && `(${summaries.length})`}
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#D02020', border: '2px solid #121212', animation: 'spin 1s linear infinite' }} />
              <div style={{ width: 12, height: 12, background: '#1040C0', border: '2px solid #121212', animation: 'spin 1s linear infinite' }} />
            </div>
          </div>
        ) : tab === 'overview' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
              <StatCard icon={Users} label="Total Users" value={analytics?.totalUsers} color="#1040C0" />
              <StatCard icon={FileText} label="Total Summaries" value={analytics?.totalSummaries} color="#D02020" />
              <StatCard icon={TrendingUp} label="Uploads Today" value={analytics?.todayUploads} color="#F0C020" />
              <StatCard icon={Star} label="Avg Rating" value={analytics?.avgRating ? `${analytics?.avgRating}/5` : '—'} color="#FFFFFF" />
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }}>
              
              {/* Chart 1 */}
              <div className="card" style={{ background: '#FFFFFF', border: '4px solid #121212', borderRadius: 0, boxShadow: '6px 6px 0px 0px #121212', padding: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 900, marginBottom: 20, color: '#7A7A7A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  [01] UPLOADS — LAST 7 DAYS
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#121212" strokeOpacity={0.15} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#4E4E4E', fontWeight: 700 }} axisLine={{ stroke: '#121212', strokeWidth: 2 }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#4E4E4E', fontWeight: 700 }} axisLine={{ stroke: '#121212', strokeWidth: 2 }} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="uploads" stroke="#D02020" strokeWidth={4} dot={{ fill: '#D02020', stroke: '#121212', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Chart 2 */}
              <div className="card" style={{ background: '#FFFFFF', border: '4px solid #121212', borderRadius: 0, boxShadow: '6px 6px 0px 0px #121212', padding: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 900, marginBottom: 20, color: '#7A7A7A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  [02] SIGNUPS — LAST 7 DAYS
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={signupData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#121212" strokeOpacity={0.15} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#4E4E4E', fontWeight: 700 }} axisLine={{ stroke: '#121212', strokeWidth: 2 }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#4E4E4E', fontWeight: 700 }} axisLine={{ stroke: '#121212', strokeWidth: 2 }} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="signups" stroke="#1040C0" strokeWidth={4} dot={{ fill: '#1040C0', stroke: '#121212', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {summaries.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '64px 32px', 
                color: '#7A7A7A', 
                fontSize: 14, 
                fontWeight: 900, 
                textTransform: 'uppercase',
                border: '4px solid #121212',
                background: '#FFFFFF',
                boxShadow: '4px 4px 0px 0px #121212'
              }}>
                No summaries yet in the database.
              </div>
            ) : (
              summaries.map(s => (
                <div 
                  key={s.id} 
                  className="card" 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '20px 24px', 
                    flexWrap: 'wrap', 
                    gap: 16,
                    background: '#FFFFFF', 
                    border: '4px solid #121212', 
                    borderRadius: 0, 
                    boxShadow: '4px 4px 0px 0px #121212'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 36, height: 36, background: '#F0C020', border: '2px solid #121212', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={18} color="#121212" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: 14, textTransform: 'uppercase', color: '#121212' }}>{s.file_name}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#7A7A7A', textTransform: 'uppercase' }}>
                        USER: {s.user_name} ({s.user_email})
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {s.rating && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 4, 
                        fontSize: 11, 
                        fontWeight: 900, 
                        background: '#D02020', 
                        color: '#FFFFFF',
                        border: '2px solid #121212', 
                        padding: '2px 8px' 
                      }}>
                        RATING: {s.rating}/5
                      </div>
                    )}
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#7A7A7A', textTransform: 'uppercase' }}>
                      {new Date(s.created_at).toLocaleDateString().toUpperCase()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

