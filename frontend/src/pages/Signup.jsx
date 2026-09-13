import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  CheckCircle2,
  Sword,
  UserPlus
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'
import { ParticleAtmosphere } from '../components/ParticleAtmosphere'
import townBg from '../assets/town_quest_bg.png'

export function Signup() {
  const navigate = useNavigate()
  const { signup, isAuthenticated } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.')
      return
    }

    setIsLoading(true)
    try {
      await signup(email.trim(), password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed. Operator may already exist.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.25rem',
        backgroundImage: `
          radial-gradient(ellipse at 50% 30%, rgba(10, 14, 26, 0.5) 0%, rgba(5, 7, 13, 0.88) 65%, rgba(3, 4, 8, 0.98) 100%),
          linear-gradient(180deg, rgba(6, 9, 16, 0.65) 0%, rgba(5, 7, 13, 0.5) 40%, rgba(4, 6, 10, 0.98) 100%),
          url(${townBg})
        `,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Cyan & Gold Particles */}
      <ParticleAtmosphere density={45} colorScheme="cyan" />

      {/* Main Glass Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '480px',
          background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.94) 0%, rgba(8, 12, 22, 0.98) 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.45)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 0 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(56, 189, 248, 0.25)',
          overflow: 'hidden',
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        {/* Top Glowing Laser Edge */}
        <div
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #38bdf8, #818cf8, #f59e0b)',
            width: '100%'
          }}
        />

        <div style={{ padding: '2.5rem 2.25rem 2rem' }}>
          {/* Header Brand */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              onClick={() => navigate('/')}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)',
                border: '1.5px solid var(--cyan-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                boxShadow: '0 0 25px rgba(56, 189, 248, 0.4)',
                marginBottom: '1rem',
                cursor: 'pointer'
              }}
            >
              <UserPlus size={28} />
            </div>

            <div
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.18em',
                color: 'var(--cyan-light)',
                textTransform: 'uppercase',
                marginBottom: '0.25rem'
              }}
            >
              INITIALIZE NEW OPERATIVE
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '2rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                margin: 0,
                lineHeight: 1.15
              }}
              className="text-gradient-cyan"
            >
              CREATE ACCOUNT
            </h1>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: 0 }}>
              Registers a level 1 vanguard in the Citadel database with baseline stats (0 XP, 0 Gold).
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.45)',
                color: '#fb7185',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                marginBottom: '1.5rem',
                animation: 'shake 0.3s ease-out'
              }}
            >
              <AlertCircle size={17} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email Field */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--cyan-light)',
                  marginBottom: '0.45rem'
                }}
              >
                OPERATOR EMAIL
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1.5px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem'
                }}
              >
                <Mail size={18} color="var(--text-muted)" style={{ marginRight: '0.75rem' }} />
                <input
                  type="email"
                  placeholder="vanguard@liferpg.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    width: '100%',
                    fontFamily: 'var(--font-body)'
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--cyan-light)',
                  marginBottom: '0.45rem'
                }}
              >
                SECURITY PASSWORD
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1.5px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem'
                }}
              >
                <Lock size={18} color="var(--text-muted)" style={{ marginRight: '0.75rem' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    width: '100%',
                    fontFamily: 'var(--font-body)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--cyan-light)',
                  marginBottom: '0.45rem'
                }}
              >
                CONFIRM PASSWORD
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1.5px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem'
                }}
              >
                <Lock size={18} color="var(--text-muted)" style={{ marginRight: '0.75rem' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    width: '100%',
                    fontFamily: 'var(--font-body)'
                  }}
                />
              </div>
            </div>

            {/* Signup Submit Button */}
            <Button
              type="submit"
              variant="cyan"
              size="lg"
              icon={ArrowRight}
              disabled={isLoading}
              id="signup-page-submit-btn"
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: '0.5rem',
                boxShadow: '0 0 25px rgba(56, 189, 248, 0.35)'
              }}
            >
              {isLoading ? 'CREATING CHARACTER...' : 'REGISTER & ENTER CITADEL'}
            </Button>
          </form>

          {/* Footer link to Login */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)'
            }}
          >
            Already have an active operative?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--cyan-light)',
                fontWeight: 800,
                textDecoration: 'none',
                fontFamily: 'var(--font-title)',
                letterSpacing: '0.04em'
              }}
            >
              SIGN IN HERE →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
