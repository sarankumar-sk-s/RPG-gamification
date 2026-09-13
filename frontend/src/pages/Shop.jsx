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
  Check
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { shopApi, inventoryApi } from '../services/api'

// Assets & Mock Data
import townBg from '../assets/town_quest_bg.png'
import { initialShopItems, initialInventoryItems } from '../data/mockShopData'
import { initialPlayerData } from '../data/mockDashboardData'

export function Shop() {
  const navigate = useNavigate()
  const { user, character, isAuthenticated, refreshProfile } = useAuth()
  const [player, setPlayer] = useState(initialPlayerData)
  const [shopItems, setShopItems] = useState(initialShopItems)
  const [inventory, setInventory] = useState(initialInventoryItems)
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

  // Sync Live Gold and Stats
  React.useEffect(() => {
    if (character) {
      setPlayer((prev) => ({
        ...prev,
        gold: character.gold ?? prev.gold,
        level: character.level ?? prev.level
      }))
    }
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
          setShopItems(mapped)
        }
      })
      .catch(() => {})

    if (isAuthenticated) {
      inventoryApi.getInventory()
        .then((invItems) => {
          if (invItems && invItems.length > 0) {
            setInventory(invItems.map((inv) => ({
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

  // Handle successful purchase
  const handleConfirmPurchase = async (item) => {
    try {
      if (typeof item.id === 'number' || !isNaN(Number(item.id))) {
        const purchaseRes = await shopApi.purchase(item.id)
        if (purchaseRes && purchaseRes.remaining_gold !== undefined) {
          setPlayer((prev) => ({
            ...prev,
            gold: purchaseRes.remaining_gold
          }))
          await refreshProfile()
        }
      } else {
        setPlayer((prev) => ({
          ...prev,
          gold: prev.gold - item.price
        }))
      }

      setPurchasedItemIds((prev) => [...prev, item.id])
      triggerToast(`🛒 Requisitioned ${item.name}!`)
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
      default:
        return ShoppingBag
    }
  }

  const categories = ['ALL', 'BOOST', 'POTION', 'BADGE', 'DEFENSE', 'ARTIFACT']

  const filteredItems = activeCategory === 'ALL'
    ? shopItems
    : shopItems.filter((i) => i.category === activeCategory)

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
            // current
          } else if (nav === 'inventory') {
            navigate('/inventory')
          } else {
            navigate('/dashboard')
          }
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
            marginBottom: '2.5rem'
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
                  Citadel Tactical Armory
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
                CITADEL ARMORY & SHOP
              </h1>

              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                maxWidth: '650px',
                lineHeight: 1.5,
                margin: 0
              }}>
                Exchange earned quest Gold for tactical boosts, flow-state potions, streak shields, and prestige vanguard insignia.
              </p>
            </div>

            {/* Treasury Balance Display & Inventory Shortcut */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              {/* Live Gold Balance Display */}
              <div
                id="shop-gold-treasury-badge"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem 1.4rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(253, 224, 71, 0.12)',
                  border: '1.5px solid var(--gold-light)',
                  boxShadow: '0 0 25px rgba(253, 224, 71, 0.25)'
                }}
              >
                <Coins size={26} color="#fde047" />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-title)', fontWeight: 800, textTransform: 'uppercase' }}>
                    YOUR CITADEL GOLD
                  </div>
                  <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-title)', fontWeight: 900, color: '#fde047', lineHeight: 1 }}>
                    GOLD {player.gold}
                  </div>
                </div>
              </div>

              {/* Go to Inventory Button */}
              <Button
                variant="outline"
                size="md"
                icon={Package}
                onClick={() => navigate('/inventory')}
                id="view-inventory-btn"
              >
                <span>MY INVENTORY</span>
                <Badge variant="gold" size="sm">
                  {inventory.reduce((acc, i) => acc + i.quantity, 0)}
                </Badge>
              </Button>
            </div>
          </div>

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
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    background: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(15, 23, 42, 0.7)',
                    border: isSelected ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                    borderRadius: '20px',
                    padding: '0.4rem 1rem',
                    color: isSelected ? 'var(--gold-light)' : 'var(--text-secondary)',
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
                  {cat}
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

              return (
                <div
                  key={item.id}
                  style={{
                    background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.88) 0%, rgba(10, 14, 24, 0.96) 100%)',
                    border: `1.5px solid ${item.accentColor}44`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.25s'
                  }}
                  className="shop-card-hover"
                >
                  {/* Top Glowing Stripe */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, ${item.accentColor}, transparent)`
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
                        <Badge variant={item.color} size="sm">
                          {item.rarity}
                        </Badge>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-title)', fontWeight: 600 }}>
                          {item.type}
                        </span>
                      </div>

                      <span style={{ fontSize: '0.78rem', color: item.accentColor, fontWeight: 700 }}>
                        {item.duration}
                      </span>
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
                          fontSize: '1.3rem',
                          fontWeight: 900,
                          color: '#ffffff',
                          margin: '0 0 0.25rem',
                          letterSpacing: '0.03em'
                        }}>
                          {item.name}
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-gold)', fontWeight: 700 }}>
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

                  {/* Card Bottom: Price and BUY Button */}
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

                    {/* BUY Button */}
                    <Button
                      variant={wasPurchased ? 'glass' : canAfford ? 'gold' : 'outline'}
                      size="sm"
                      icon={wasPurchased ? Check : ShoppingBag}
                      onClick={() => setSelectedItemForPurchase(item)}
                      id={`buy-item-${item.id}`}
                    >
                      {wasPurchased ? 'BUY AGAIN' : 'BUY'}
                    </Button>
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
