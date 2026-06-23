import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FileText, LayoutDashboard, Shield, LogOut, Sparkles } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
    }}>
      <div style={{
        width: '100%', maxWidth: '100%', margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 60,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'var(--accent)', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <FileText size={16} color="var(--bg)" />
          </div>
          <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.3px' }}>Summarize</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {token ? (
            <>
              <Link to="/dashboard">
                <button className="btn btn-ghost" style={{
                  padding: '7px 14px',
                  color: isActive('/dashboard') ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderColor: isActive('/dashboard') ? 'var(--border-hover)' : 'transparent',
                }}>
                  <LayoutDashboard size={15} /> Dashboard
                </button>
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin">
                  <button className="btn btn-ghost" style={{ padding: '7px 14px' }}>
                    <Shield size={15} /> Admin
                  </button>
                </Link>
              )}
              <button className="btn btn-ghost" style={{ padding: '7px 14px' }} onClick={logout}>
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn btn-ghost" style={{ padding: '7px 14px' }}>Login</button>
              </Link>
              <Link to="/register">
                <button className="btn btn-primary" style={{ padding: '7px 14px' }}>Get started</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
