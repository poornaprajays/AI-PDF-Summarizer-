import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { Loader } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const res = await authAPI.register(form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: 24,
      background: '#F0F0F0',
      backgroundImage: 'radial-gradient(rgba(18, 18, 18, 0.07) 1.5px, transparent 1.5px)',
      backgroundSize: '24px 24px'
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#D02020', border: '2px solid #121212' }} />
              <div style={{ width: 14, height: 14, background: '#1040C0', border: '2px solid #121212' }} />
              <div style={{ 
                width: 0, height: 0, 
                borderLeft: '7px solid transparent', 
                borderRight: '7px solid transparent', 
                borderBottom: '14px solid #F0C020',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute', top: 1, left: -7,
                  width: 0, height: 0,
                  borderLeft: '7px solid transparent',
                  borderRight: '7px solid transparent',
                  borderBottom: '14px solid #121212',
                  zIndex: -1
                }} />
              </div>
            </div>
            <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.8px', textTransform: 'uppercase', color: '#121212' }}>Summarize</span>
          </Link>

          <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 8, color: '#121212', textTransform: 'uppercase' }}>
            REGISTER
          </h1>
          <p style={{ color: '#7A7A7A', fontSize: 11, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            CREATE A NEW SYSTEM ACCOUNT
          </p>
        </div>

        <div className="card" style={{ 
          borderLeft: '16px solid #1040C0', // Blue color block border for registration
          background: '#FFFFFF',
          padding: '32px 28px',
          boxShadow: '8px 8px 0px 0px #121212'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 900, marginBottom: 8, color: '#121212', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                FULL NAME
              </label>
              <input 
                className="input" 
                type="text" 
                name="name" 
                placeholder="JANE SMITH" 
                value={form.name} 
                onChange={handleChange} 
                required 
                style={{ borderRadius: 0, border: '4px solid #121212', textTransform: 'uppercase', fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 900, marginBottom: 8, color: '#121212', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                EMAIL ADDRESS
              </label>
              <input 
                className="input" 
                type="email" 
                name="email" 
                placeholder="YOU@EXAMPLE.COM" 
                value={form.email} 
                onChange={handleChange} 
                required 
                style={{ borderRadius: 0, border: '4px solid #121212', textTransform: 'uppercase', fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 900, marginBottom: 8, color: '#121212', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                PASSWORD
              </label>
              <input 
                className="input" 
                type="password" 
                name="password" 
                placeholder="MIN. 6 CHARACTERS" 
                value={form.password} 
                onChange={handleChange} 
                required 
                style={{ borderRadius: 0, border: '4px solid #121212', fontWeight: 700 }}
              />
            </div>

            {error && (
              <div style={{ 
                background: 'rgba(208,32,32,0.08)', 
                border: '4px solid #D02020', 
                padding: '12px 16px', 
                fontSize: 13, 
                color: '#D02020',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }}>
                ERROR: {error}
              </div>
            )}

            <button 
              className="btn btn-blue" 
              type="submit" 
              disabled={loading} 
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                padding: '16px', 
                marginTop: 8,
                borderRadius: 0
              }}
            >
              {loading ? (
                <>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite', marginRight: 8 }} />
                  CREATING ACCOUNT...
                </>
              ) : (
                'CREATE ACCOUNT'
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, fontWeight: 700, color: '#4E4E4E', textTransform: 'uppercase' }}>
          ALREADY REGISTERED?{' '}
          <Link to="/login" style={{ color: '#1040C0', textDecoration: 'underline', textDecorationThickness: '2px' }}>
            SIGN IN HERE
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

