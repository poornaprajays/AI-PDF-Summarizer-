import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Shield, LogOut, Menu, X } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')
  const [menuOpen, setMenuOpen] = useState(false)

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setMenuOpen(false)
    navigate('/')
  }

  const isActive = (path) => location.pathname === path
  const close = () => setMenuOpen(false)

  return (
    <nav
      className="nav-root"
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#F0F0F0',
        borderBottom: '4px solid #121212',
        padding: '0 48px',
      }}
    >
      <div style={{
        width: '100%', maxWidth: '100%', margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 70,
      }}>
        {/* ── Geometric Bauhaus Logo ── */}
        <Link to="/" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Red Circle */}
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#D02020', border: '2px solid #121212' }} />
            {/* Blue Square */}
            <div style={{ width: 18, height: 18, background: '#1040C0', border: '2px solid #121212' }} />
            {/* Yellow Triangle */}
            <div style={{
              width: 0, height: 0,
              borderLeft: '9px solid transparent',
              borderRight: '9px solid transparent',
              borderBottom: '18px solid #F0C020',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: -1, left: -9,
                width: 0, height: 0,
                borderLeft: '9px solid transparent',
                borderRight: '9px solid transparent',
                borderBottom: '18px solid #121212',
                zIndex: -1
              }} />
            </div>
          </div>
          <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-0.8px', textTransform: 'uppercase', color: '#121212' }}>
            Summarize
          </span>
        </Link>

        {/* ── Desktop Nav Links (hidden on mobile via CSS) ── */}
        <div className="nav-links-desktop">
          {token ? (
            <>
              <Link to="/dashboard">
                <button className="btn btn-ghost" style={{
                  padding: '8px 16px',
                  color: '#121212',
                  border: '2px solid #121212',
                  boxShadow: isActive('/dashboard') ? 'none' : '2px 2px 0px 0px #121212',
                  transform: isActive('/dashboard') ? 'translate(2px, 2px)' : 'none',
                }}>
                  <LayoutDashboard size={15} /> Dashboard
                </button>
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin">
                  <button className="btn btn-ghost" style={{
                    padding: '8px 16px',
                    color: '#121212',
                    border: '2px solid #121212',
                    boxShadow: isActive('/admin') ? 'none' : '2px 2px 0px 0px #121212',
                    transform: isActive('/admin') ? 'translate(2px, 2px)' : 'none',
                  }}>
                    <Shield size={15} /> Admin
                  </button>
                </Link>
              )}
              <button className="btn btn-ghost" style={{ padding: '8px 16px', border: '2px solid transparent', boxShadow: 'none' }} onClick={logout}>
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="btn btn-ghost" style={{ padding: '8px 16px', border: '2px solid transparent', boxShadow: 'none' }}>Login</button>
              </Link>
              <Link to="/register">
                <button className="btn btn-yellow" style={{ padding: '8px 20px', border: '2px solid #121212', boxShadow: '2px 2px 0px 0px #121212' }}>Get started</button>
              </Link>
            </>
          )}
        </div>

        {/* ── Hamburger Button (only visible on mobile via CSS) ── */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          style={{
            background: 'none',
            border: '3px solid #121212',
            padding: '6px 8px',
            cursor: 'pointer',
            boxShadow: '2px 2px 0 0 #121212',
            transition: 'all 0.15s',
          }}
        >
          {menuOpen ? <X size={20} color="#121212" /> : <Menu size={20} color="#121212" />}
        </button>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      <div className={`nav-mobile-menu ${menuOpen ? 'open' : ''}`}>
        {token ? (
          <>
            <Link to="/dashboard" onClick={close}>
              <button className="nav-mobile-link" style={{
                background: isActive('/dashboard') ? '#1040C0' : '#FFFFFF',
                color: isActive('/dashboard') ? '#FFFFFF' : '#121212',
              }}>
                <LayoutDashboard size={16} /> Dashboard
              </button>
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" onClick={close}>
                <button className="nav-mobile-link" style={{
                  background: isActive('/admin') ? '#1040C0' : '#FFFFFF',
                  color: isActive('/admin') ? '#FFFFFF' : '#121212',
                }}>
                  <Shield size={16} /> Admin
                </button>
              </Link>
            )}
            <button className="nav-mobile-link" onClick={logout} style={{ color: '#D02020', borderColor: '#D02020' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={close}>
              <button className="nav-mobile-link">Login</button>
            </Link>
            <Link to="/register" onClick={close}>
              <button className="nav-mobile-link" style={{ background: '#F0C020', color: '#121212' }}>
                Get Started
              </button>
            </Link>
          </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </nav>
  )
}
