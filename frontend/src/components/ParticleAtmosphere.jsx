import React, { useEffect, useRef } from 'react'

/**
 * ParticleAtmosphere: High-performance HTML5 Canvas generating subtle
 * floating golden/crimson embers, cosmic dust, and light motes.
 */
export function ParticleAtmosphere({ density = 45, colorScheme = 'gold' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    // Palette definition
    const colors = colorScheme === 'gold' 
      ? ['rgba(245, 158, 11, ', 'rgba(253, 224, 71, ', 'rgba(244, 63, 94, ', 'rgba(251, 146, 60, ']
      : ['rgba(56, 189, 248, ', 'rgba(192, 132, 252, ', 'rgba(245, 158, 11, ']

    // Create particles
    const particles = []
    const particleCount = Math.min(density, Math.floor((width * height) / 25000))

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.8,
        speedY: -(Math.random() * 0.45 + 0.15),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulseVal: Math.random() * Math.PI,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach((p) => {
        p.y += p.speedY
        p.x += p.speedX
        p.pulseVal += p.pulseSpeed

        // Wrap around borders
        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10

        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulseVal))

        // Draw soft glowing particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${Math.max(0, currentOpacity)})`
        ctx.shadowBlur = p.size * 3
        ctx.shadowColor = `${p.color}0.8)`
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [density, colorScheme])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  )
}

export default ParticleAtmosphere
