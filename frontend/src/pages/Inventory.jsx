import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Navbar,
  Button,
  Badge
} from '../components'
import {
  Package,
  Sparkles,
  Zap,
  Award,
  Shield,
  HeartPulse,
  Compass,
  CheckCircle2,
  ShoppingBag,
  Coins,
  ArrowRight,
  Flame,
  Check
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { inventoryApi } from '../services/api'

// Assets & Mock Data
import panoramaBg from '../assets/rpg_panorama_bg.jpg'
import { initialInventoryItems } from '../data/mockShopData'
import { initialPlayerData } from '../data/mockDashboardData'

export function Inventory() {
  const navigate = useNavigate()
  const { user, character, isAuthenticated } = useAuth()
  const [player, setPlayer] = useState(initialPlayerData)
  const [inventory, setInventory] = useState(initialInventoryItems)
  const [activeTab, setActiveTab] = useState('ALL')
  const [toastMessage, setToastMessage] = useState(null)
  const [activeBuffs, setActiveBuffs] = useState([])

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 3500)
  }

  // Sync Live Character Stats
  React.useEffect(() => {
    if (character) {
      setPlayer((prev) => ({
        ...prev,
        gold: character.gold ?? prev.gold,
        level: character.level ?? prev.level
      }))
    }
  }, [character])

  // Fetch live inventory from backend
  React.useEffect(() => {
    if (isAuthenticated) {
      inventoryApi.getInventory()
        .then((items) => {
          if (items && items.length > 0) {
            setInventory(items.map((inv) => ({
              id: inv.id,
              shopId: inv.item_id,
              name: inv.item?.name || 'Vault Item',
              category: (inv.item?.category || 'BOOST').toUpperCase(),
              type: 'Consumable',
              quantity: inv.quantity,
              rarity: 'Rare',
              color: 'gold',
              accentColor: '#fbbf24',
              icon: 'Package',
              description: inv.item?.description || 'Stored in Citadel Vault.',
              canUse: true,
              isEquipped: false
            })))
          }
        })
        .catch(() => {})
    }
  }, [isAuthenticated])

  // Handle Using a consumable item
  const handleUseItem = (itemId) => {
    const item = inventory.find((i) => i.id === itemId)
    if (!item || item.quantity <= 0) return

    // Apply item effect
    if (item.name.includes('XP BOOST')) {
      setActiveBuffs((prev) => [...prev, 'XP Boost +50% Active (3 Quests)'])
      triggerToast(`⚡ Activated XP BOOST! +50% XP will apply to your next 3 quests.`)
    } else if (item.name.includes('FOCUS POTION')) {
      setActiveBuffs((prev) => [...prev, 'Focus Potion Active (2 Hours)'])
      triggerToast(`🧪 Consumed FOCUS POTION! Wisdom flow-state enabled for 2 hours.`)
    } else if (item.name.includes('VITALITY')) {
      setActiveBuffs((prev) => [...prev, 'Vitality Buff Active (+2)'])
      triggerToast(`🌿 Consumed ELIXIR OF VITALITY! Cellular recovery buff activated.`)
    } else {
      triggerToast(`Used ${item.name}!`)
    }

    // Decrement quantity
    setInventory((prev) =>
      prev
        .map((inv) => {
          if (inv.id === itemId) {
            return { ...inv, quantity: inv.quantity - 1 }
          }
          return inv
        })
        .filter((inv) => inv.quantity > 0 || !inv.canUse)
    )
  }

  const getItemIcon = (iconName) => {
    switch (iconName) {
      case 'Sparkles':
        return Sparkles
      case 'Zap':
        return Zap
      case 'Award':
        return Award
      case 'Shield':
        return Shield
      case 'HeartPulse':
        return HeartPulse
      case 'Compass':
        return Compass
      default:
        return Package
    }
  }

  const filterTabs = ['ALL', 'Consumable', 'Prestige Relic', 'Relic']

  const filteredInventory = activeTab === 'ALL'
    ? inventory
    : inventory.filter((i) => i.type === activeTab)

  const totalItemCount = inventory.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundImage: `
          linear-gradient(180deg, rgba(6, 9, 16, 0.68) 0%, rgba(5, 7, 13, 0.85) 45%, rgba(4, 6, 10, 0.98) 100%),
          url(${panoramaBg})
        `,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center top',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Viewport Overlay */}
      <div className="game-viewport-overlay" />

      {/* Floating Reward Toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '85px',
            right: '24px',
            zIndex: 999,
            background: 'rgba(15, 23, 42, 0.96)',
            border: '1px solid var(--gold-primary)',
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.5), 0 8px 24px rgba(0,0,0,0.8)',
            borderRadius: 'var(--radius-md)',
            padding: '0.9rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--text-gold)',
            fontFamily: 'var(--font-title)',
            fontSize: '0.95rem',
            fontWeight: 700,
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          <Sparkles size={18} color="#fde047" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVIGATION */}
      <Navbar
        level={player.level}
        currentXP={player.currentXP}
        xpRequired={player.xpRequired}
        gold={player.gold}
        streak={player.streak}
        activeLink="shop"
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
            navigate('/world')
          } else if (nav === 'shop') {
            navigate('/shop')
          } else if (nav === 'inventory') {
            // current
          } else {
            navigate('/dashboard')
          }
        }}
        onProfileClick={() => navigate('/character')}
      />

      {/* MAIN INVENTORY BODY */}
      <main style={{ flex: 1, padding: '2.5rem 0 5rem', position: 'relative', zIndex: 1 }}>
        <div className="container-custom">
          {/* Header Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span style={{
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: 'var(--cyan-light)',
                  textTransform: 'uppercase'
                }}>
                  Tactical Vault & Gear Bag
                </span>
                <span style={{ width: '30px', height: '1px', background: 'var(--cyan-primary)' }} />
              </div>

              <h1 style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: 900,
                letterSpacing: '0.04em',
                lineHeight: 1.1,
                margin: 0,
                marginBottom: '0.5rem'
              }} className="text-gradient-cyan">
                MY INVENTORY
              </h1>

              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                maxWidth: '650px',
                lineHeight: 1.5,
                margin: 0
              }}>
                Manage tactical consumables, deploy active multipliers, and equip prestige relics earned through real-world quest execution.
              </p>
            </div>

            {/* Quick Actions & Armory Link */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Button
                variant="gold"
                size="md"
                icon={ShoppingBag}
                onClick={() => navigate('/shop')}
              >
                BUY SUPPLIES
              </Button>
            </div>
          </div>

          {/* Active Buffs Notification Banner if any buffs are active */}
          {activeBuffs.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
              border: '1.5px solid rgba(56, 189, 248, 0.4)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem 1.25rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Sparkles size={20} color="#38bdf8" />
                <div>
                  <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>
                    ACTIVE OPERATIONAL BUFFS ({activeBuffs.length})
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#38bdf8' }}>
                    {activeBuffs.join(' • ')}
                  </div>
                </div>
              </div>
              <Badge variant="cyan" size="sm">ACTIVE</Badge>
            </div>
          )}

          {/* Filter Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '2rem'
          }}>
            {filterTabs.map((tab) => {
              const isSelected = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.7)',
                    border: isSelected ? '1px solid var(--cyan-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: '20px',
                    padding: '0.4rem 1rem',
                    color: isSelected ? 'var(--cyan-light)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-title)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab === 'ALL' ? `ALL ITEMS (${totalItemCount})` : tab}
                </button>
              )
            })}
          </div>

          {/* INVENTORY ITEM CARDS GRID */}
          {filteredInventory.length === 0 ? (
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px dashed var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '3.5rem 2rem',
              textAlign: 'center'
            }}>
              <Package size={45} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontFamily: 'var(--font-title)', color: '#ffffff', marginBottom: '0.5rem' }}>
                Inventory Vault Empty
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                Visit the Citadel Armory to purchase boosts, potions, and gear badges.
              </p>
              <Button
                variant="gold"
                size="md"
                icon={ShoppingBag}
                onClick={() => navigate('/shop')}
              >
                Go to Shop
              </Button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.75rem'
            }}>
              {filteredInventory.map((item) => {
                const ItemIcon = getItemIcon(item.icon)

                return (
                  <div
                    key={item.id}
                    style={{
                      background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.88) 0%, rgba(10, 14, 24, 0.96) 100%)',
                      border: item.isEquipped
                        ? '1.5px solid var(--gold-primary)'
                        : `1px solid ${item.accentColor}44`,
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: item.isEquipped
                        ? '0 0 25px rgba(245, 158, 11, 0.25), 0 8px 30px rgba(0, 0, 0, 0.6)'
                        : '0 8px 30px rgba(0, 0, 0, 0.5)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.25s'
                    }}
                    className="inv-card-hover"
                  >
                    {/* Top Stripe */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, ${item.accentColor}, transparent)`
                    }} />

                    <div>
                      {/* Header: Rarity & Quantity Badge */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Badge variant={item.color} size="sm">
                            {item.rarity}
                          </Badge>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-title)', fontWeight: 600 }}>
                            {item.type}
                          </span>
                        </div>

                        <span style={{
                          fontFamily: 'var(--font-title)',
                          fontSize: '1rem',
                          fontWeight: 900,
                          color: '#ffffff',
                          background: 'rgba(255, 255, 255, 0.08)',
                          padding: '0.2rem 0.65rem',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)'
                        }}>
                          x{item.quantity}
                        </span>
                      </div>

                      {/* Icon & Title */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '12px',
                          background: `${item.accentColor}18`,
                          border: `1.5px solid ${item.accentColor}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: item.accentColor,
                          flexShrink: 0,
                          boxShadow: `0 0 20px ${item.accentColor}33`
                        }}>
                          <ItemIcon size={26} />
                        </div>

                        <div>
                          <h3 style={{
                            fontFamily: 'var(--font-title)',
                            fontSize: '1.25rem',
                            fontWeight: 900,
                            color: '#ffffff',
                            margin: '0 0 0.25rem',
                            letterSpacing: '0.03em'
                          }}>
                            {item.name}
                          </h3>
                          {item.isEquipped && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-gold)', fontWeight: 800, textTransform: 'uppercase' }}>
                              ⚡ CURRENTLY EQUIPPED
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p style={{
                        fontSize: '0.88rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.5,
                        margin: '0 0 1.25rem'
                      }}>
                        {item.description}
                      </p>
                    </div>

                    {/* Footer: USE Action Button */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Status: <strong style={{ color: '#ffffff' }}>{item.isEquipped ? 'Active Relic' : 'Ready'}</strong>
                      </span>

                      {item.canUse ? (
                        <Button
                          variant="cyan"
                          size="sm"
                          icon={Zap}
                          onClick={() => handleUseItem(item.id)}
                          id={`use-item-${item.id}`}
                        >
                          USE ITEM
                        </Button>
                      ) : (
                        <Badge variant="gold" size="sm">
                          EQUIPPED
                        </Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <style>{`
        .inv-card-hover:hover {
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  )
}

export default Inventory
