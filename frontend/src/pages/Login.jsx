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
  Sword
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'
import { ParticleAtmosphere } from '../components/ParticleAtmosphere'
import panoramaBg from '../assets/rpg_panorama_bg.jpg'

export function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      setError('Please provide both operator email and security password.')
      return
    }

    setIsLoading(true)
    try {
      await login(email.trim(), password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  // Quick Demo Login for testing convenience
  const handleQuickDemoLogin = async () => {
    setError('')
    setIsLoading(true)
    const demoEmail = 'vanguard@liferpg.io'
    const demoPass = 'password123'

    try {
      await login(demoEmail, demoPass)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Demo operator sign-in failed.')
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
          url(${panoramaBg})
        `,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dynamic Golden Embers */}
      <ParticleAtmosphere density={45} colorScheme="gold" />

      {/* Main Glass Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '460px',
          background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.94) 0%, rgba(8, 12, 22, 0.98) 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.45)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 0 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(245, 158, 11, 0.25)',
          overflow: 'hidden',
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        {/* Top Glowing Laser Edge */}
        <div
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #38bdf8, #f59e0b, #ef4444)',
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
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(244, 63, 94, 0.25) 100%)',
                border: '1.5px solid var(--gold-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24',
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.4)',
                marginBottom: '1rem',
                cursor: 'pointer'
              }}
            >
              <Sword size={28} />
            </div>

            <div
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.18em',
                color: 'var(--text-gold)',
                textTransform: 'uppercase',
                marginBottom: '0.25rem'
              }}
            >
              CITADEL SECURE ACCESS
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
              className="text-gradient-gold"
            >
              OPERATOR LOGIN
            </h1>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: 0 }}>
              Authenticate to synchronize character progress, gold, and daily quests.
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
                  color: 'var(--text-gold)',
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
                  padding: '0.75rem 1rem',
                  transition: 'border-color 0.2s'
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <label
                  style={{
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-title)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-gold)',
                    margin: 0
                  }}
                >
                  SECURITY PASSWORD
                </label>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1.5px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  transition: 'border-color 0.2s'
                }}
              >
                <Lock size={18} color="var(--text-muted)" style={{ marginRight: '0.75rem' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
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

            {/* Login Submit Button */}
            <Button
              type="submit"
              variant="gold"
              size="lg"
              icon={ArrowRight}
              disabled={isLoading}
              id="login-page-submit-btn"
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: '0.5rem',
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.35)'
              }}
            >
              {isLoading ? 'AUTHENTICATING...' : 'ENTER CITADEL DASHBOARD'}
            </Button>

            {/* Quick Demo Login Option */}
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={isLoading}
              style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 1rem',
                color: '#38bdf8',
                fontFamily: 'var(--font-title)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              <Zap size={16} /> ONE-CLICK TEST OPERATOR SIGN-IN
            </button>
          </form>

          {/* Footer link to Signup */}
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
            Don't have an operative profile?{' '}
            <Link
              to="/signup"
              style={{
                color: 'var(--gold-light)',
                fontWeight: 800,
                textDecoration: 'none',
                fontFamily: 'var(--font-title)',
                letterSpacing: '0.04em'
              }}
            >
              CREATE NEW CHARACTER →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
