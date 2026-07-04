import { useState } from 'react'
import { X, Loader } from 'lucide-react'
import { authAPI } from '../services/api'

export default function ProfileModal({ isOpen, onClose, onProfileUpdate }) {
  const initialUser = JSON.parse(localStorage.getItem('user') || '{}')
  
  // Profile Name Form States
  const [name, setName] = useState(initialUser.name || '')
  const [nameLoading, setNameLoading] = useState(false)
  const [nameError, setNameError] = useState('')
  const [nameSuccess, setNameSuccess] = useState('')

  // Password Change Form States
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  if (!isOpen) return null

  const handleNameSubmit = async (e) => {
    e.preventDefault()
    setNameError('')
    setNameSuccess('')
    if (!name.trim()) {
      setNameError('Name identifier cannot be empty.')
      return
    }
    setNameLoading(true)
    try {
      const res = await authAPI.updateProfile({ name: name.trim() })
      const updatedUser = res.data.user
      // Update local storage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      const nextUser = { ...currentUser, name: updatedUser.name }
      localStorage.setItem('user', JSON.stringify(nextUser))
      
      setNameSuccess('Profile identifier updated successfully!')
      onProfileUpdate(nextUser)
      window.dispatchEvent(new Event('profileUpdated'))
    } catch (err) {
      setNameError(err.response?.data?.message || 'Failed to update profile name.')
    } finally {
      setNameLoading(false)
    }
  }

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    const { currentPassword, newPassword, confirmPassword } = passwordForm

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.')
      return
    }

    setPasswordLoading(true)
    try {
      await authAPI.changePassword({ currentPassword, newPassword })
      setPasswordSuccess('Password reconfigured successfully!')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Could not change password.')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(18, 18, 18, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '24px'
    }}>
      <div 
        className="card" 
        style={{
          width: '100%',
          maxWidth: '520px',
          background: '#FFFFFF',
          border: '4px solid #121212',
          borderRadius: 0,
          boxShadow: '12px 12px 0px 0px #121212',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '32px 28px'
        }}
      >
        {/* Header decoration */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: '#F0C020', borderBottom: '4px solid #121212' }} />

        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-1px', color: '#121212', margin: 0 }}>
              USER PROFILE STATUS
            </h2>
            <div style={{ fontSize: 11, fontWeight: 900, color: '#7A7A7A', letterSpacing: '0.05em', marginTop: 4 }}>
              SECURE IDENTIFIER AND PASSWORD CONTROL
            </div>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-ghost" 
            style={{ 
              padding: '8px 10px', 
              border: '3px solid #121212', 
              boxShadow: '3px 3px 0px 0px #121212', 
              borderRadius: 0,
              background: '#FFFFFF'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Section divider */}
        <div style={{ height: 4, background: '#121212' }} />

        {/* Section 1: User Identifier Info */}
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.05em', color: '#121212', marginBottom: 16 }}>
            [01] PERSONAL IDENTIFIER SETTINGS
          </h3>

          <form onSubmit={handleNameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 900, marginBottom: 8, color: '#121212', letterSpacing: '0.05em' }}>
                REGISTERED EMAIL (READ ONLY)
              </label>
              <input 
                className="input" 
                type="text" 
                value={initialUser.email || ''} 
                disabled 
                style={{ 
                  borderRadius: 0, 
                  border: '4px solid #121212', 
                  background: '#EAEAEA', 
                  fontWeight: 700, 
                  color: '#7A7A7A',
                  cursor: 'not-allowed',
                  textTransform: 'uppercase'
                }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 900, marginBottom: 8, color: '#121212', letterSpacing: '0.05em' }}>
                USER FULL NAME
              </label>
              <input 
                className="input" 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                placeholder="YOUR NAME"
                style={{ 
                  borderRadius: 0, 
                  border: '4px solid #121212', 
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }} 
              />
            </div>

            {nameError && (
              <div style={{ 
                background: 'rgba(208,32,32,0.08)', 
                border: '4px solid #D02020', 
                padding: '10px 14px', 
                fontSize: 12, 
                color: '#D02020',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                ERROR: {nameError}
              </div>
            )}

            {nameSuccess && (
              <div style={{ 
                background: 'rgba(16,64,192,0.08)', 
                border: '4px solid #1040C0', 
                padding: '10px 14px', 
                fontSize: 12, 
                color: '#1040C0',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                SUCCESS: {nameSuccess}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-blue" 
              disabled={nameLoading}
              style={{ borderRadius: 0, width: '100%', justifyContent: 'center', padding: '12px' }}
            >
              {nameLoading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'SAVE IDENTIFIER'}
            </button>
          </form>
        </div>

        {/* Section divider */}
        <div style={{ height: 4, background: '#121212' }} />

        {/* Section 2: Password Control */}
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.05em', color: '#121212', marginBottom: 16 }}>
            [02] PASSWORD RECONFIGURATION
          </h3>

          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 900, marginBottom: 8, color: '#121212', letterSpacing: '0.05em' }}>
                CURRENT PASSWORD
              </label>
              <input 
                className="input" 
                type="password" 
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
                placeholder="••••••••"
                style={{ borderRadius: 0, border: '4px solid #121212', fontWeight: 700 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 900, marginBottom: 8, color: '#121212', letterSpacing: '0.05em' }}>
                NEW PASSWORD
              </label>
              <input 
                className="input" 
                type="password" 
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
                placeholder="••••••••"
                style={{ borderRadius: 0, border: '4px solid #121212', fontWeight: 700 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 900, marginBottom: 8, color: '#121212', letterSpacing: '0.05em' }}>
                CONFIRM NEW PASSWORD
              </label>
              <input 
                className="input" 
                type="password" 
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
                placeholder="••••••••"
                style={{ borderRadius: 0, border: '4px solid #121212', fontWeight: 700 }}
              />
            </div>

            {passwordError && (
              <div style={{ 
                background: 'rgba(208,32,32,0.08)', 
                border: '4px solid #D02020', 
                padding: '10px 14px', 
                fontSize: 12, 
                color: '#D02020',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                ERROR: {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div style={{ 
                background: 'rgba(16,64,192,0.08)', 
                border: '4px solid #1040C0', 
                padding: '10px 14px', 
                fontSize: 12, 
                color: '#1040C0',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                SUCCESS: {passwordSuccess}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-yellow" 
              disabled={passwordLoading}
              style={{ borderRadius: 0, width: '100%', justifyContent: 'center', padding: '12px' }}
            >
              {passwordLoading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'UPDATE PASSWORD'}
            </button>
          </form>
        </div>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  )
}
