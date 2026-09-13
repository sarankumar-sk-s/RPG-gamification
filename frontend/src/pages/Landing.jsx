import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sword,
  Shield,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Volume2,
  VolumeX,
  Compass,
  Flame,
  CheckCircle2,
  Award,
  Layers,
  ChevronRight,
  Eye,
  LogIn,
  UserPlus
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { ParticleAtmosphere } from '../components/ParticleAtmosphere'
import { HowItWorksModal } from '../components/HowItWorksModal'

// Original High-Resolution RPG Backgrounds
import panoramaBg from '../assets/rpg_panorama_bg.jpg'
import townBg from '../assets/town_quest_bg.png'
import wallSkyBg from '../assets/wall_sky_bg.png'

export function Landing() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false)
  const [activeScene, setActiveScene] = useState('panorama')
  const [isMuted, setIsMuted] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger entrance animation on mount
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const scenes = {
    panorama: {
      name: 'Citadel Horizon',
      image: panoramaBg
    },
    town: {
      name: 'Guild Town',
      image: townBg
    },
    wall: {
      name: 'Titan Sky Wall',
      image: wallSkyBg
    }
  }

  // Simple Web Audio API Synth Chime for immersive feedback on interaction
  const playSfx = (type = 'click') => {
    if (isMuted) return
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      if (type === 'start') {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(220, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35)
        gain.gain.setValueAtTime(0.15, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
        osc.start()
        osc.stop(ctx.currentTime + 0.35)
      } else {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(440, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15)
        gain.gain.setValueAtTime(0.1, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
        osc.start()
        osc.stop(ctx.currentTime + 0.15)
      }
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  const handleEnterWorld = () => {
    playSfx('start')
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/login')
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
        justifyContent: 'space-between',
        backgroundImage: `
          radial-gradient(ellipse at 50% 30%, rgba(10, 14, 26, 0.4) 0%, rgba(5, 7, 13, 0.82) 65%, rgba(3, 4, 8, 0.96) 100%),
          linear-gradient(180deg, rgba(6, 9, 16, 0.6) 0%, rgba(5, 7, 13, 0.4) 40%, rgba(4, 6, 10, 0.95) 100%),
          url(${scenes[activeScene].image})
        `,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        transition: 'background-image 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Dynamic Canvas Embers & Atmospheric Particles */}
      <ParticleAtmosphere density={55} colorScheme="gold" />

      {/* Cinematic Vignette & Ambient Color Flares */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 2,
          background: `
            radial-gradient(circle at 15% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 85% 75%, rgba(244, 63, 94, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 50% 90%, rgba(56, 189, 248, 0.08) 0%, transparent 50%)
          `
        }}
      />

      {/* Subtle Horizontal Anamorphic Laser Flare */}
      <div
        style={{
          position: 'absolute',
          top: '36%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85vw',
          maxWidth: '1100px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.35) 50%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 2,
          filter: 'blur(1px)'
        }}
      />

      {/* Top Game Navigation HUD */}
      <header
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          background: 'linear-gradient(180deg, rgba(6, 9, 16, 0.7) 0%, rgba(6, 9, 16, 0) 100%)'
        }}
      >
        {/* Brand Crest */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(244, 63, 94, 0.2) 100%)',
              border: '1px solid var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.35)'
            }}
          >
            <Sword size={20} color="#fde047" />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-title)',
                fontWeight: 900,
                fontSize: '1.35rem',
                letterSpacing: '0.12em',
                lineHeight: 1
              }}
              className="text-gradient-gold"
            >
              LIFE RPG
            </div>
            <div
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.18em',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-title)',
                fontWeight: 600
              }}
            >
              REALITY ENGINE v1.0
            </div>
          </div>
        </div>

        {/* Right HUD Controls: Auth, Audio & Scene Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Direct Auth Header CTA */}
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              id="landing-header-dashboard-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(244, 63, 94, 0.25) 100%)',
                border: '1.5px solid var(--gold-primary)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-gold)',
                padding: '0.4rem 1rem',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-title)',
                fontWeight: 800,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)'
              }}
            >
              <Zap size={14} /> CITADEL DASHBOARD
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => navigate('/login')}
                id="landing-header-login-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-full)',
                  color: '#ffffff',
                  padding: '0.4rem 0.95rem',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gold-primary)'
                  e.currentTarget.style.color = 'var(--gold-light)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-medium)'
                  e.currentTarget.style.color = '#ffffff'
                }}
              >
                <LogIn size={14} /> SIGN IN
              </button>

              <button
                onClick={() => navigate('/signup')}
                id="landing-header-signup-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid var(--cyan-primary)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--cyan-light)',
                  padding: '0.4rem 0.95rem',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <UserPlus size={14} /> SIGN UP
              </button>
            </div>
          )}

          {/* Quick Scene Chooser */}
          <div
            className="landing-scene-selector"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(10, 14, 24, 0.65)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '0.2rem 0.5rem'
            }}
          >
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-title)', fontWeight: 700, padding: '0 0.25rem' }}>
              <Eye size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
              SCENE
            </span>
            {Object.keys(scenes).map((key) => (
              <button
                key={key}
                onClick={() => {
                  playSfx()
                  setActiveScene(key)
                }}
                style={{
                  background: activeScene === key ? 'var(--gold-primary)' : 'transparent',
                  color: activeScene === key ? '#000' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-title)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {scenes[key].name}
              </button>
            ))}
          </div>

          {/* Audio Feedback Toggle */}
          <button
            onClick={() => {
              setIsMuted(!isMuted)
              if (isMuted) playSfx()
            }}
            title={isMuted ? 'Enable UI Audio' : 'Mute UI Audio'}
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isMuted ? 'var(--text-dim)' : 'var(--gold-light)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--gold-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
            }}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </header>

      {/* Main Cinematic Content Hero */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1.5rem',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            maxWidth: '920px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.75rem',
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Animated Kicker / Tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.45rem 1.1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border-gold)',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.25)',
              animation: 'pulseGlow 3.5s infinite ease-in-out'
            }}
          >
            <Sparkles size={16} color="#fde047" />
            <span
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                color: 'var(--text-gold)',
                textTransform: 'uppercase'
              }}
            >
              REALITY GAMIFICATION PROTOCOL
            </span>
          </div>

          {/* Main Title: LIFE RPG */}
          <div style={{ position: 'relative' }}>
            <h1
              style={{
                fontSize: 'clamp(3.4rem, 9.5vw, 6.5rem)',
                fontFamily: 'var(--font-title)',
                fontWeight: 900,
                letterSpacing: '0.06em',
                lineHeight: 0.95,
                margin: 0,
                textTransform: 'uppercase',
                textShadow: `
                  0 4px 18px rgba(0, 0, 0, 0.98),
                  0 0 35px rgba(245, 158, 11, 0.4),
                  0 0 70px rgba(244, 63, 94, 0.25)
                `
              }}
            >
              <span className="text-gradient-gold">LIFE</span>{' '}
              <span style={{ color: '#ffffff' }}>RPG</span>
            </h1>
          </div>

          {/* Subheading: YOUR LIFE = YOUR GAME */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '-0.5rem'
            }}
          >
            <div
              style={{
                width: 'clamp(24px, 5vw, 50px)',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--red-accent))'
              }}
            />
            <h2
              style={{
                fontSize: 'clamp(1.2rem, 3.2vw, 2.1rem)',
                fontFamily: 'var(--font-title)',
                fontWeight: 800,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                margin: 0,
                color: 'var(--text-main)',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.9), 0 0 20px rgba(244, 63, 94, 0.4)'
              }}
            >
              YOUR LIFE <span style={{ color: 'var(--red-light)' }}>=</span> YOUR GAME
            </h2>
            <div
              style={{
                width: 'clamp(24px, 5vw, 50px)',
                height: '2px',
                background: 'linear-gradient(90deg, var(--red-accent), transparent)'
              }}
            />
          </div>

          {/* Short Introduction: Real-life goals become quests */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2.1vw, 1.35rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.95), 0 0 15px rgba(0, 0, 0, 0.7)',
              fontWeight: 400
            }}
          >
            Transform your everyday habits, ambitions, and challenges into epic real-world quests. Level up your discipline, earn rewards, and conquer your highest potential in an ancient cyber-fantasy realm.
          </p>

          {/* CTA Buttons Cluster */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem',
              marginTop: '0.75rem',
              width: '100%',
              maxWidth: '560px'
            }}
          >
            {/* Primary Action: ENTER WORLD */}
            <button
              onClick={handleEnterWorld}
              id="landing-enter-world-btn"
              className="pulse-glow"
              style={{
                flex: '1 1 240px',
                minHeight: '56px',
                padding: '0.9rem 2.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #fde047 0%, #f59e0b 50%, #d97706 100%)',
                color: '#06080e',
                fontFamily: 'var(--font-title)',
                fontWeight: 900,
                fontSize: '1.2rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 0 30px rgba(245, 158, 11, 0.6), 0 8px 24px rgba(0,0,0,0.8)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'
                e.currentTarget.style.boxShadow = '0 0 45px rgba(245, 158, 11, 0.85), 0 12px 30px rgba(0,0,0,0.9)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(245, 158, 11, 0.6), 0 8px 24px rgba(0,0,0,0.8)'
              }}
            >
              <Sword size={22} color="#06080e" />
              <span>ENTER WORLD</span>
              <ArrowRight size={20} color="#06080e" />
            </button>

            {/* Secondary Option: LEARN HOW IT WORKS */}
            <button
              onClick={() => {
                playSfx()
                setIsHowItWorksOpen(true)
              }}
              id="landing-learn-how-btn"
              style={{
                flex: '1 1 200px',
                minHeight: '56px',
                padding: '0.9rem 1.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(12, 16, 26, 0.75)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-title)',
                fontWeight: 700,
                fontSize: '1.05rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: '1px solid var(--border-highlight)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--gold-primary)'
                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.12)'
                e.currentTarget.style.color = 'var(--gold-light)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-highlight)'
                e.currentTarget.style.background = 'rgba(12, 16, 26, 0.75)'
                e.currentTarget.style.color = 'var(--text-main)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <HelpCircle size={19} color="var(--gold-primary)" />
              <span>LEARN HOW IT WORKS</span>
            </button>
          </div>

          {/* Quick Access Links if not authenticated */}
          {!isAuthenticated && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                fontSize: '0.88rem',
                color: 'var(--text-muted)',
                marginTop: '0.25rem'
              }}
            >
              <span>
                Existing Operative?{' '}
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--gold-light)',
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-title)',
                    letterSpacing: '0.04em',
                    textDecoration: 'underline'
                  }}
                >
                  Sign In
                </button>
              </span>
              <span>•</span>
              <span>
                New Recruit?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--cyan-light)',
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-title)',
                    letterSpacing: '0.04em',
                    textDecoration: 'underline'
                  }}
                >
                  Create Account
                </button>
              </span>
            </div>
          )}

          {/* Tactical Core Feature Pillars */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '0.85rem',
              width: '100%',
              maxWidth: '780px',
              marginTop: '1.25rem'
            }}
          >
            {[
              { label: 'Real-World Quests', icon: Target, desc: 'Tasks = XP' },
              { label: '5 Core Attributes', icon: Zap, desc: 'Real stats growth' },
              { label: 'Streak Combos', icon: Flame, desc: 'Multiply rewards' },
              { label: 'Boss Conquests', icon: Award, desc: 'Slay resistance' }
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(8, 12, 20, 0.65)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(245, 158, 11, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <feature.icon size={16} color="var(--gold-primary)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-title)', fontWeight: 700, color: 'var(--text-main)' }}>
                    {feature.label}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    {feature.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Cinematic Bottom HUD Footer */}
      <footer
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '1.25rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(0deg, rgba(4, 6, 10, 0.95) 0%, rgba(4, 6, 10, 0.6) 100%)',
          fontSize: '0.8rem',
          color: 'var(--text-dim)',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green-accent)', boxShadow: '0 0 8px var(--green-accent)' }} />
          <span style={{ fontFamily: 'var(--font-title)', fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
            CITADEL SERVERS ONLINE • LATENCY 14ms
          </span>
        </div>

        <div style={{ fontFamily: 'var(--font-title)', letterSpacing: '0.05em' }}>
          © LIFE RPG // ALL RIGHTS RESERVED • ORIGINAL REALITY FRAMEWORK
        </div>
      </footer>

      {/* Learn How It Works Lore Briefing Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onEnterWorld={handleEnterWorld}
      />
    </div>
  )
}

export default Landing
