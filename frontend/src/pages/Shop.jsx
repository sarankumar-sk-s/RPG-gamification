import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Navbar,
  Button,
  Badge,
  PurchaseModal
} from '../components'
import {
  ShoppingBag,
  Coins,
  Sparkles,
  Zap,
  Award,
  Shield,
  HeartPulse,
  Compass,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight,
  Flame,
  Check,
  User,
  Lock,
  Eye,
  AlertCircle,
  PlusCircle
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { shopApi, inventoryApi } from '../services/api'
import { getCurrentStreak } from '../utils/streakManager'

// Assets & Mock Data
import townBg from '../assets/town_quest_bg.png'
import { initialShopItems, initialInventoryItems } from '../data/mockShopData'
import { initialPlayerData } from '../data/mockDashboardData'

export function Shop() {
  const navigate = useNavigate()
  const { user, character, isAuthenticated, refreshProfile } = useAuth()
  const [player, setPlayer] = useState(initialPlayerData)
  const [shopItems, setShopItems] = useState(initialShopItems)

  // Initialize inventory from localStorage or default
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('life_rpg_vault_inventory')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return initialInventoryItems
  })

  const [selectedItemForPurchase, setSelectedItemForPurchase] = useState(null)
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [toastMessage, setToastMessage] = useState(null)
  const [purchasedItemIds, setPurchasedItemIds] = useState([])

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev))
    }, 3500)
  }

  // Sync Live Gold, Stats, XP, and Streak
  React.useEffect(() => {
    const currentStreak = character?.streak || getCurrentStreak()
    const storedGold = localStorage.getItem('life_rpg_player_gold')
    const storedXP = localStorage.getItem('life_rpg_player_xp')

    let effectiveGold = 100
    if (character && typeof character.gold === 'number') {
      effectiveGold = character.gold
    } else if (storedGold !== null) {
      effectiveGold = parseInt(storedGold, 10)
    }

    const effectiveXP = (character && typeof character.xp === 'number')
      ? character.xp
      : (storedXP !== null ? parseInt(storedXP, 10) : 0)

    const charLevel = character?.level || 1
    const charReq = character?.xp_required || (charLevel * 100)

    setPlayer((prev) => ({
      ...prev,
      gold: effectiveGold,
      level: charLevel,
      currentXP: effectiveXP,
      xpRequired: charReq,
      streak: currentStreak
    }))
  }, [character])

  // Fetch live shop items & inventory
  React.useEffect(() => {
    shopApi.getItems()
      .then((items) => {
        if (items && items.length > 0) {
          const mapped = items.map((i) => ({
            id: i.id,
            name: i.name,
            category: (i.category || 'BOOST').toUpperCase(),
            type: 'Consumable',
            rarity: i.price >= 100 ? 'Legendary' : i.price >= 60 ? 'Epic' : 'Rare',
            price: i.price,
            icon: i.name.includes('XP') ? 'Sparkles' : i.name.includes('Focus') ? 'Zap' : 'Award',
            color: i.price >= 100 ? 'gold' : i.price >= 60 ? 'purple' : 'cyan',
            accentColor: i.price >= 100 ? '#fbbf24' : i.price >= 60 ? '#c084fc' : '#38bdf8',
            description: i.description || 'Tactical requisition item.',
            duration: 'Active',
            effectText: `Requisition: ${i.name}`
          }))

          // Merge live items with initial mock items (to preserve Avatar coming soon and special items)
          const merged = [...mapped]
          initialShopItems.forEach((mockItem) => {
            if (!merged.some((m) => m.name.toLowerCase() === mockItem.name.toLowerCase())) {
              merged.push(mockItem)
            }
          })
          setShopItems(merged)
        }
      })
      .catch(() => {})

    if (isAuthenticated) {
      inventoryApi.getInventory()
        .then((invItems) => {
          if (invItems && invItems.length > 0) {
            const mappedBackend = invItems.map((inv) => ({
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
            }))
            setInventory(mappedBackend)
            localStorage.setItem('life_rpg_vault_inventory', JSON.stringify(mappedBackend))
          }
        })
        .catch(() => {})
    }
  }, [isAuthenticated])

  // Grant emergency requisition gold if needed
  const handleClaimGoldGrant = () => {
    const newGold = player.gold + 300
    setPlayer((prev) => ({ ...prev, gold: newGold }))
    localStorage.setItem('life_rpg_player_gold', String(newGold))
    triggerToast('🪙 Vanguard Requisition Grant Claimed: +300 GOLD added to balance!')
  }

  // Handle successful purchase & update streak, XP, gold, and inventory
  const handleConfirmPurchase = async (item) => {
    if (item.isComingSoon) {
      triggerToast(`🔒 ${item.name} is coming soon in future Life RPG updates!`)
      return
    }

    try {
      // 1. Deduct Gold
      const updatedGold = Math.max(0, player.gold - item.price)
      localStorage.setItem('life_rpg_player_gold', String(updatedGold))

      // Try backend purchase in background
      if (typeof item.id === 'number' || !isNaN(Number(item.id))) {
        try {
          await shopApi.purchase(Number(item.id))
        } catch (apiErr) {
          console.warn('Backend shop purchase error, continuing with client state:', apiErr)
        }
      }

      // 2. Increment & Persist Streak
      const currentStoredStreak = parseInt(localStorage.getItem('life_rpg_streak_count') || String(player.streak || 1), 10)
      const newStreak = currentStoredStreak + 1
      localStorage.setItem('life_rpg_streak_count', String(newStreak))

      // 3. Grant XP on purchase (+50 XP for XP items, +25 XP for others)
      const xpGained = item.name.includes('XP') ? 50 : 25
      let newXP = player.currentXP + xpGained
      let newLevel = player.level
      let newReq = player.xpRequired

      if (newXP >= newReq) {
        newLevel += 1
        newXP = newXP - newReq
        newReq = newLevel * 100
        triggerToast(`🎉 LEVEL UP! You reached Level ${newLevel}!`)
      }
      localStorage.setItem('life_rpg_player_xp', String(newXP))

      // 4. Update player state (Gold, Streak, and XP updated in HUD)
      setPlayer((prev) => ({
        ...prev,
        gold: updatedGold,
        streak: newStreak,
        currentXP: newXP,
        level: newLevel,
        xpRequired: newReq
      }))

      // Sync character in memory if available
      if (character) {
        character.gold = updatedGold
        character.streak = newStreak
        character.xp = newXP
        character.level = newLevel
      }

      // 5. Update Inventory and Persist
      let updatedInv = []
      setInventory((prev) => {
        const existing = prev.find((inv) => inv.shopId === item.id || inv.name === item.name)
        if (existing) {
          updatedInv = prev.map((inv) =>
            inv.id === existing.id ? { ...inv, quantity: inv.quantity + 1 } : inv
          )
        } else {
          updatedInv = [
            ...prev,
            {
              id: `inv-${item.id}-${Date.now()}`,
              shopId: item.id,
              name: item.name,
              category: item.category,
              type: item.type || 'Consumable',
              quantity: 1,
              rarity: item.rarity || 'Rare',
              color: item.color || 'gold',
              accentColor: item.accentColor || '#fbbf24',
              icon: item.icon || 'Package',
              description: item.description,
              canUse: true,
              isEquipped: false
            }
          ]
        }
        localStorage.setItem('life_rpg_vault_inventory', JSON.stringify(updatedInv))
        return updatedInv
      })

      setPurchasedItemIds((prev) => [...prev, item.id])
      triggerToast(`🛒 Requisitioned ${item.name}! • 🔥 STREAK +1 (${newStreak}d) • ✨ +${xpGained} XP!`)

      if (isAuthenticated) {
        refreshProfile().catch(() => {})
      }
    } catch (err) {
      triggerToast(`Purchase error: ${err.message}`)
    }
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
      case 'User':
        return User
      case 'Lock':
        return Lock
      default:
        return ShoppingBag
    }
  }

  const categories = ['ALL', 'AVATAR', 'BOOST', 'POTION', 'BADGE', 'DEFENSE', 'ARTIFACT']

  const filteredItems = activeCategory === 'ALL'
    ? shopItems
    : shopItems.filter((i) => i.category === activeCategory)

  const totalInventoryCount = inventory.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundImage: `
          linear-gradient(180deg, rgba(6, 9, 16, 0.65) 0%, rgba(5, 7, 13, 0.82) 45%, rgba(4, 6, 10, 0.98) 100%),
          url(${townBg})
        `,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center top',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Viewport Overlay */}
      <div className="game-viewport-overlay" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '85px',
            right: '24px',
            zIndex: 1200,
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
          if (nav === 'landing') navigate('/')
          else if (nav === 'dashboard') navigate('/dashboard')
          else if (nav === 'missions') navigate('/missions')
          else if (nav === 'story') navigate('/story')
          else if (nav === 'character') navigate('/character')
          else if (nav === 'world') navigate('/world')
          else if (nav === 'inventory') navigate('/inventory')
          else navigate('/dashboard')
        }}
        onProfileClick={() => navigate('/character')}
      />

      {/* MAIN SHOP BODY */}
      <main style={{ flex: 1, padding: '2.5rem 0 5rem', position: 'relative', zIndex: 1 }}>
        <div className="container-custom">
          {/* Header Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span style={{
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: 'var(--text-gold)',
                  textTransform: 'uppercase'
                }}>
                  Citadel Armory & Requisition
                </span>
                <span style={{ width: '30px', height: '1px', background: 'var(--gold-primary)' }} />
              </div>

              <h1 style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: 900,
                letterSpacing: '0.04em',
                lineHeight: 1.1,
                margin: 0,
                marginBottom: '0.5rem'
              }} className="text-gradient-gold">
                TACTICAL SUPPLY SHOP
              </h1>

              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                maxWidth: '650px',
                lineHeight: 1.5,
                margin: 0
              }}>
                Exchange earned quest Gold for tactical boosts, flow-state potions, streak shields, and character upgrades. Every purchase fuels your daily momentum and awards XP!
              </p>
            </div>

            {/* Right Side Stats & Inventory Shortcut */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Player Gold Balance Display */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%)',
                border: '1.5px solid var(--gold-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)'
              }} id="shop-player-gold">
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fbbf24'
                }}>
                  <Coins size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-title)', fontWeight: 700 }}>
                    AVAILABLE BALANCE
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: 'var(--text-gold)',
                    lineHeight: 1.1
                  }}>
                    {player.gold} <span style={{ fontSize: '0.85rem', color: '#fbbf24' }}>GOLD</span>
                  </div>
                </div>

                {/* Quick Gold Grant if low */}
                {player.gold < 150 && (
                  <button
                    onClick={handleClaimGoldGrant}
                    style={{
                      marginLeft: '0.5rem',
                      background: 'rgba(245, 158, 11, 0.25)',
                      border: '1px solid var(--gold-primary)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.25rem 0.5rem',
                      color: 'var(--text-gold)',
                      fontFamily: 'var(--font-title)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                    title="Claim Vanguard Requisition Grant (+300 Gold)"
                  >
                    <PlusCircle size={12} />
                    <span>+300 GOLD</span>
                  </button>
                )}
              </div>

              {/* Streak Indicator Chip */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(225, 29, 72, 0.08) 100%)',
                border: '1.5px solid rgba(244, 63, 94, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem'
              }} id="shop-player-streak">
                <Flame size={20} color="#fb7185" />
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-title)', fontWeight: 700 }}>
                    MOMENTUM
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    color: '#fb7185',
                    lineHeight: 1.1
                  }}>
                    {player.streak} <span style={{ fontSize: '0.8rem' }}>DAYS</span>
                  </div>
                </div>
              </div>

              {/* Inventory Shortcut Button */}
              <Button
                variant="glass"
                size="md"
                icon={Package}
                onClick={() => navigate('/inventory')}
                id="view-inventory-btn"
              >
                <span>MY INVENTORY</span>
                <Badge variant="gold" size="sm" id="shop-inventory-badge">
                  {totalInventoryCount}
                </Badge>
              </Button>
            </div>
          </div>

          {/* AVATAR COMING SOON SHOWCASE BANNER */}
          {(activeCategory === 'ALL' || activeCategory === 'AVATAR') && (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.75) 0%, rgba(15, 23, 42, 0.92) 50%, rgba(88, 28, 135, 0.45) 100%)',
                border: '1.5px solid rgba(192, 132, 252, 0.45)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.85rem 2rem',
                marginBottom: '2.5rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 0 40px rgba(192, 132, 252, 0.18), 0 10px 30px rgba(0,0,0,0.8)'
              }}
              id="avatar-coming-soon-banner"
            >
              {/* Ambient Glow */}
              <div
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(192, 132, 252, 0.35) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                  pointerEvents: 'none'
                }}
              />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.5rem',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{ maxWidth: '620px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <span style={{
                      background: 'rgba(192, 132, 252, 0.2)',
                      border: '1px solid rgba(192, 132, 252, 0.5)',
                      color: '#c084fc',
                      padding: '0.2rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-title)',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}>
                      <Lock size={12} />
                      <span>AVATAR WARDROBE • COMING SOON 🔒</span>
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                      CITADEL TELEMETRY LINK
                    </span>
                  </div>

                  <h2 style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                    fontWeight: 900,
                    color: '#ffffff',
                    margin: '0 0 0.5rem',
                    letterSpacing: '0.03em'
                  }}>
                    AVATAR CUSTOMIZATION & SKINS
                  </h2>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                    Customize your operator's appearance with legendary 3D player avatars, Attack on Titan Scout Regiment uniforms, Armored Vanguard plating, and shifting bio-electric auras.
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  flexWrap: 'wrap'
                }}>
                  {['SCOUT CLOAK', 'ARMORED PLATE', 'SHIFTER AURA'].map((skin, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        background: 'rgba(15, 23, 42, 0.85)',
                        border: '1px solid rgba(192, 132, 252, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.82rem',
                        fontFamily: 'var(--font-title)',
                        fontWeight: 800
                      }}
                    >
                      <User size={15} color="#c084fc" />
                      <span>{skin}</span>
                      <Lock size={12} color="#fb7185" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Category Filter Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '2rem'
          }}>
            {categories.map((cat) => {
              const isSelected = activeCategory === cat
              const isAvatar = cat === 'AVATAR'

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    background: isSelected
                      ? 'rgba(245, 158, 11, 0.25)'
                      : isAvatar
                      ? 'rgba(192, 132, 252, 0.15)'
                      : 'rgba(15, 23, 42, 0.7)',
                    border: isSelected
                      ? '1px solid var(--gold-primary)'
                      : isAvatar
                      ? '1px solid rgba(192, 132, 252, 0.45)'
                      : '1px solid var(--border-subtle)',
                    borderRadius: '20px',
                    padding: '0.45rem 1.1rem',
                    color: isSelected
                      ? 'var(--gold-light)'
                      : isAvatar
                      ? '#d8b4fe'
                      : 'var(--text-secondary)',
                    fontFamily: 'var(--font-title)',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.2s'
                  }}
                  id={`filter-category-${cat.toLowerCase()}`}
                >
                  {isAvatar && <Lock size={12} color="#c084fc" />}
                  <span>{cat}{isAvatar ? ' 🔒' : ''}</span>
                </button>
              )
            })}
          </div>

          {/* SHOP ITEMS GRID */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem'
          }}>
            {filteredItems.map((item) => {
              const ItemIcon = getItemIcon(item.icon)
              const wasPurchased = purchasedItemIds.includes(item.id)
              const canAfford = player.gold >= item.price
              const isComingSoon = item.isComingSoon

              return (
                <div
                  key={item.id}
                  style={{
                    background: isComingSoon
                      ? 'linear-gradient(180deg, rgba(20, 18, 40, 0.88) 0%, rgba(10, 12, 24, 0.96) 100%)'
                      : 'linear-gradient(180deg, rgba(17, 24, 39, 0.88) 0%, rgba(10, 14, 24, 0.96) 100%)',
                    border: isComingSoon
                      ? '1.5px solid rgba(192, 132, 252, 0.45)'
                      : `1.5px solid ${item.accentColor}44`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isComingSoon
                      ? '0 8px 30px rgba(192, 132, 252, 0.12)'
                      : '0 8px 30px rgba(0, 0, 0, 0.5)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.25s'
                  }}
                  className="shop-card-hover"
                  id={`shop-item-card-${item.id}`}
                >
                  {/* Top Glowing Stripe */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: isComingSoon
                      ? 'linear-gradient(90deg, #c084fc, #fb7185)'
                      : `linear-gradient(90deg, ${item.accentColor}, transparent)`
                  }} />

                  <div>
                    {/* Header: Rarity & Type */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Badge variant={isComingSoon ? 'purple' : item.color} size="sm">
                          {item.rarity}
                        </Badge>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-title)', fontWeight: 600 }}>
                          {item.type}
                        </span>
                      </div>

                      {isComingSoon ? (
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#c084fc',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <Lock size={12} />
                          <span>COMING SOON 🔒</span>
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: item.accentColor, fontWeight: 700 }}>
                          {item.duration}
                        </span>
                      )}
                    </div>

                    {/* Item Icon & Title */}
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
                        <div style={{ fontSize: '0.8rem', color: isComingSoon ? '#c084fc' : 'var(--text-gold)', fontWeight: 700 }}>
                          ⚡ {item.effectText}
                        </div>
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

                  {/* Card Bottom: Price and Action Button */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    {/* Price Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Coins size={18} color="#fbbf24" />
                      <span style={{
                        fontFamily: 'var(--font-title)',
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        color: 'var(--text-gold)'
                      }}>
                        {item.price}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-title)', fontWeight: 700 }}>
                        GOLD
                      </span>
                    </div>

                    {/* Action Button: BUY or COMING SOON */}
                    {isComingSoon ? (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Lock}
                        onClick={() => triggerToast(`🔒 ${item.name} is coming soon in future updates!`)}
                        id={`coming-soon-btn-${item.id}`}
                        style={{
                          borderColor: 'rgba(192, 132, 252, 0.4)',
                          color: '#c084fc',
                          cursor: 'not-allowed'
                        }}
                      >
                        COMING SOON 🔒
                      </Button>
                    ) : (
                      <Button
                        variant={wasPurchased ? 'glass' : canAfford ? 'gold' : 'outline'}
                        size="sm"
                        icon={wasPurchased ? Check : ShoppingBag}
                        onClick={() => setSelectedItemForPurchase(item)}
                        id={`buy-item-${item.id}`}
                      >
                        {wasPurchased ? 'BUY AGAIN' : 'BUY'}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      {/* CONFIRMATION PURCHASE MODAL */}
      <PurchaseModal
        isOpen={!!selectedItemForPurchase}
        onClose={() => setSelectedItemForPurchase(null)}
        item={selectedItemForPurchase}
        playerGold={player.gold}
        onConfirmPurchase={handleConfirmPurchase}
      />

      <style>{`
        .shop-card-hover:hover {
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  )
}

export default Shop
