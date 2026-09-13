import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Navbar,
  Button,
  Badge
} from '../components'
import {
  Globe,
  Sparkles,
  Lock,
  Compass,
  Sword,
  LayoutDashboard,
  Shield,
  Layers,
  MapPin,
  Clock,
  Radio,
  Zap,
  Radar
} from 'lucide-react'

import panoramaBg from '../assets/rpg_panorama_bg.jpg'
import wallSkyBg from '../assets/wall_sky_bg.png'
import { initialPlayerData } from '../data/mockDashboardData'
import { useAuth } from '../context/AuthContext'
import { getCurrentStreak } from '../utils/streakManager'

export function World() {
  const navigate = useNavigate()
  const { user, character } = useAuth()
  const [player, setPlayer] = useState(initialPlayerData)

  // Sync Live Character Stats for Navbar HUD
  React.useEffect(() => {
    if (character && user) {
      const charLevel = character.level || 1
      const charXP = character.xp || 0
      const charRequired = charLevel * 100
      const currentStreak = character.streak || getCurrentStreak()
      const savedCustomName = localStorage.getItem('life_rpg_custom_name')
      const initialName = savedCustomName || (user.email ? user.email.split('@')[0].toUpperCase() : 'VANGUARD')

      setPlayer({
        name: initialName,
        title: charLevel >= 10 ? 'Ascendant Architect' : charLevel >= 5 ? 'Citadel Vanguard' : 'Initiate Operative',
        level: charLevel,
        currentXP: charXP,
        xpRequired: charRequired,
        gold: character.gold ?? 0,
        streak: currentStreak,
        rank: charLevel >= 5 ? 'A-Tier Operative' : 'Recruit',
        avatarUrl: null
      })
    }
  }, [character, user])

  const upcomingFeatures = [
    {
      icon: Compass,
      title: 'Realms & Biomes',
      desc: 'Unlock distinct real-world habit regions: Iron Citadel, Sky Sanctum, and Deep Nebula.',
      color: '#38bdf8'
    },
    {
      icon: Radio,
      title: 'Live Sector Outposts',
      desc: 'Collaborative guild zones and territorial mastery maps powered by daily quest completions.',
      color: '#f59e0b'
    },
    {
      icon: Zap,
      title: 'World Boss Raids',
      desc: 'Assemble with other operatives to tackle large-scale lifestyle and productivity challenges.',
      color: '#f43f5e'
    }
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundImage: `
          linear-gradient(180deg, rgba(6, 9, 16, 0.7) 0%, rgba(5, 7, 13, 0.85) 45%, rgba(4, 6, 10, 0.98) 100%),
          url(${panoramaBg})
        `,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center top',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Glow Overlay */}
      <div className="game-viewport-overlay" />

      {/* TOP HUD NAVIGATION */}
      <Navbar
        level={player.level}
        currentXP={player.currentXP}
        xpRequired={player.xpRequired}
        gold={player.gold}
        streak={player.streak}
        activeLink="world"
        onNavigate={(nav) => {
          if (nav === 'landing') {
            navigate('/')
          } else if (nav === 'dashboard') {
            navigate('/dashboard')
          } else if (nav === 'missions') {
            navigate('/missions')
          } else if (nav === 'story') {
            navigate('/story')
          } else if (nav === 'character') {
            navigate('/character')
          } else if (nav === 'world') {
            // current
          } else if (nav === 'shop') {
            navigate('/shop')
          } else if (nav === 'inventory') {
            navigate('/inventory')
          } else {
            navigate('/dashboard')
          }
        }}
        onProfileClick={() => navigate('/character')}
      />

      {/* MAIN COMING SOON HERO */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1.5rem 5rem',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div
          style={{
            maxWidth: '780px',
            width: '100%',
            textAlign: 'center',
            background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.9) 0%, rgba(10, 14, 24, 0.96) 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2.5rem',
            boxShadow: '0 0 50px rgba(56, 189, 248, 0.2), 0 20px 40px rgba(0, 0, 0, 0.85)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Top Cyan Glowing Line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #38bdf8, #f59e0b, #34d399)'
            }}
          />

          {/* Holographic Glowing Globe Icon Container */}
          <div
            style={{
              width: '100px',
              height: '100px',
              margin: '0 auto 1.75rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%)',
              border: '2px solid rgba(56, 189, 248, 0.6)',
              boxShadow: '0 0 40px rgba(56, 189, 248, 0.4), inset 0 0 20px rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              animation: 'pulse 3s infinite'
            }}
          >
            <Globe size={52} strokeWidth={1.5} />
          </div>

          {/* Kicker Chip */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                padding: '0.35rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Clock size={14} /> RADAR SCAN IN PROGRESS
            </span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              fontWeight: 900,
              letterSpacing: '0.04em',
              lineHeight: 1.1,
              margin: '0 0 1rem'
            }}
            className="text-gradient-cyan"
          >
            WORLD MAP COMING SOON
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              maxWidth: '580px',
              margin: '0 auto 2.25rem'
            }}
          >
            Citadel surveyors are calibrating regional topology, territory factions, and planetary quest nodes.
            Continue conquering daily missions to level up your clearance!
          </p>

          {/* Teaser Feature Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2.5rem',
              textAlign: 'left'
            }}
          >
            {upcomingFeatures.map((feat, idx) => {
              const Icon = feat.icon
              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.15rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: `rgba(255, 255, 255, 0.05)`,
                      border: `1px solid ${feat.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: feat.color,
                      marginBottom: '0.75rem'
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <h4
                    style={{
                      fontFamily: 'var(--font-title)',
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      margin: '0 0 0.35rem'
                    }}
                  >
                    {feat.title}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.45, margin: 0 }}>
                    {feat.desc}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Quick Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            <Button
              variant="cyan"
              size="lg"
              icon={Sword}
              onClick={() => navigate('/missions')}
              id="world-go-missions-btn"
            >
              Go to Missions
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon={LayoutDashboard}
              onClick={() => navigate('/dashboard')}
              id="world-go-dashboard-btn"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default World

