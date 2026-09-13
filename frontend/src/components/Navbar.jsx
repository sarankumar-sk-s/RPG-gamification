import React, { useState } from 'react'
import {
  Sword,
  Coins,
  Flame,
  Menu,
  X,
  Shield,
  ShoppingBag,
  History,
  User,
  BookOpen,
  Globe,
  Zap,
  Sparkles,
  LogOut,
  LogIn,
  LayoutDashboard
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function Navbar({
  level = 1,
  currentXP = 0,
  xpRequired = 100,
  gold = 0,
  streak = 1,
  activeLink = 'dashboard',
  onNavigate = () => {},
  onProfileClick = null
}) {
  const { isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'missions', label: 'Missions', icon: Shield },
    { id: 'story', label: 'Story', icon: BookOpen },
    { id: 'world', label: 'World', icon: Globe },
    { id: 'character', label: 'Character', icon: Zap },
    { id: 'shop', label: 'Shop', icon: ShoppingBag }
  ]

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
      background: 'rgba(8, 11, 18, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div className="container-custom" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Brand Logo & Title */}
        <div
          onClick={() => onNavigate('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
          title="Return to Story Intro"
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(244, 63, 94, 0.25) 100%)',
            border: '1px solid var(--gold-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24',
            boxShadow: '0 0 14px rgba(245, 158, 11, 0.35)'
          }}>
            <Sword size={20} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-title)',
              fontSize: '1.45rem',
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              lineHeight: 1
            }} className="text-gradient-gold">
              LIFE RPG
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '1.8rem'
        }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = activeLink === link.id
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                id={`nav-link-${link.id}`}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: isActive ? 'var(--text-gold)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-title)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  position: 'relative',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'
                }}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                    boxShadow: '0 0 8px rgba(245, 158, 11, 0.8)'
                  }} />
                )}
              </button>
            )
          })}
        </nav>

        {/* User HUD Stats (Right Side: Level, XP, Gold, Profile) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          {/* Level HUD Badge */}
          <div
            id="hud-level-badge"
            style={{
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.45)',
              color: '#fbbf24',
              fontFamily: 'var(--font-title)',
              fontWeight: 800,
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap'
            }}
          >
            LVL {level}
          </div>

          {/* XP HUD Chip */}
          <div
            className="hud-xp-chip"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38bdf8',
              fontFamily: 'var(--font-title)',
              fontWeight: 700,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Sparkles size={13} color="#38bdf8" />
            <span>{currentXP}/{xpRequired} XP</span>
          </div>

          {/* Gold HUD Balance */}
          <div
            id="hud-gold-badge"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              color: 'var(--text-gold)',
              fontFamily: 'var(--font-title)',
              fontWeight: 700,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Coins size={14} color="#fbbf24" />
            <span>{gold}</span>
          </div>

          {/* Streak Flame (Compact) */}
          <div
            className="hud-streak-chip"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.3rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              color: '#fb7185',
              fontFamily: 'var(--font-title)',
              fontWeight: 700,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Flame size={14} color="#f43f5e" />
            <span>{streak}d</span>
          </div>

          {/* Profile & Logout Action Buttons */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <button
                onClick={onProfileClick || (() => onNavigate('character'))}
                id="hud-profile-btn"
                title="Character Profile"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%)',
                  border: '1.5px solid var(--gold-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 0 10px rgba(245, 158, 11, 0.25)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)'
                  e.currentTarget.style.borderColor = '#ffffff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.borderColor = 'var(--gold-primary)'
                }}
              >
                <User size={18} color="#fde047" />
              </button>

              <button
                onClick={() => {
                  logout()
                  onNavigate('landing')
                }}
                id="hud-logout-btn"
                title="Sign Out / Disconnect"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid rgba(244, 63, 94, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fb7185',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(244, 63, 94, 0.25)'
                  e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(244, 63, 94, 0.12)'
                  e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.35)'
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              id="hud-login-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1.5px solid var(--gold-primary)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-gold)',
                padding: '0.35rem 0.85rem',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-title)',
                fontWeight: 800,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <LogIn size={15} /> SIGN IN
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              padding: '0.4rem',
              marginLeft: '0.25rem'
            }}
            className="mobile-nav-toggle"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(10, 14, 24, 0.98)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem'
        }} className="mobile-drawer">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = activeLink === link.id
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id)
                  setMobileMenuOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: isActive ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: isActive ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-subtle)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'var(--gold-light)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-title)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Icon size={18} color={isActive ? 'var(--gold-primary)' : 'var(--text-dim)'} />
                <span>{link.label}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Responsive media styling */}
      <style>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
          .mobile-drawer {
            display: none !important;
          }
        }
        @media (max-width: 859px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: flex !important;
          }
        }
        @media (max-width: 600px) {
          .hud-xp-chip {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .hud-streak-chip {
            display: none !important;
          }
        }
      `}</style>
    </header>
  )
}

export default Navbar
