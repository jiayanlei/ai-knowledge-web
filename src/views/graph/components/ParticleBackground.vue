<template>
  <canvas ref="canvasRef" class="particle-bg" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let rafId = 0
let mouseX = -9999
let mouseY = -9999

interface Star {
  x: number; y: number; vx: number; vy: number
  r: number; o: number; baseO: number; layer: number; hue: number
}

interface Meteor {
  x: number; y: number; len: number; speed: number; alpha: number
  delay: number; life: number; hue: number
}

function init() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d', { alpha: true })
  if (!ctx) return
  const parent = canvas.parentElement!

  const getRect = () => parent.getBoundingClientRect()
  let W = 0, H = 0, dpr = 1

  function resize() {
    const r = getRect()
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    W = r.width; H = r.height
    canvas!.width = W * dpr
    canvas!.height = H * dpr
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()

  /* ---- Stars ---- */
  const stars: Star[] = []
  const COUNT = Math.min(90, Math.floor(W * H / 12000))
  for (let i = 0; i < COUNT; i++) {
    const layer = Math.random()
    const speed = layer < 0.4 ? 0.08 : layer < 0.75 ? 0.18 : 0.32
    stars.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: layer < 0.4 ? Math.random() * 0.8 + 0.3
        : layer < 0.75 ? Math.random() * 1.4 + 0.5
        : Math.random() * 2 + 0.8,
      o: 0,
      baseO: layer < 0.4 ? Math.random() * 0.15 + 0.05
        : layer < 0.75 ? Math.random() * 0.25 + 0.1
        : Math.random() * 0.4 + 0.15,
      layer,
      hue: Math.random() < 0.15 ? 240 + Math.random() * 40
        : Math.random() < 0.08 ? 180 + Math.random() * 20
        : 220
    })
  }

  /* ---- Nebula glows ---- */
  const nebulae = [
    { x: 0.25, y: 0.35, rx: 280, ry: 180, color: 'rgba(99,102,241,0.025)', phase: 0 },
    { x: 0.72, y: 0.65, rx: 220, ry: 160, color: 'rgba(139,92,246,0.02)', phase: 1.5 },
    { x: 0.5, y: 0.5, rx: 350, ry: 250, color: 'rgba(6,182,212,0.015)', phase: 3 },
    { x: 0.15, y: 0.75, rx: 180, ry: 120, color: 'rgba(168,85,247,0.018)', phase: 4.5 }
  ]

  /* ---- Light meteor trails ---- */
  const meteors: Meteor[] = []
  const METEOR_COUNT = Math.max(4, Math.min(9, Math.floor(W * H / 90000)))
  function resetMeteor(m: Meteor, first = false) {
    m.x = Math.random() * W * 1.15 - W * 0.1
    m.y = -Math.random() * H * 0.45 - 20
    m.len = 42 + Math.random() * 54
    m.speed = 0.55 + Math.random() * 0.45
    m.alpha = 0
    m.delay = first ? Math.random() * 280 : 120 + Math.random() * 260
    m.life = 0
    m.hue = Math.random() < 0.65 ? 195 + Math.random() * 20 : 225 + Math.random() * 25
  }
  for (let i = 0; i < METEOR_COUNT; i++) {
    const meteor = {} as Meteor
    resetMeteor(meteor, true)
    meteors.push(meteor)
  }

  /* ---- Mouse tracking ---- */
  const onMove = (e: MouseEvent) => {
    const rect = getRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
  }
  const onLeave = () => { mouseX = -9999; mouseY = -9999 }
  parent.addEventListener('mousemove', onMove, { passive: true })
  parent.addEventListener('mouseleave', onLeave, { passive: true })

  /* ---- Render ---- */
  let t = 0
  function draw() {
    t += 0.008
    ctx!.clearRect(0, 0, W, H)

    // Nebula
    for (const n of nebulae) {
      const pulse = 0.7 + 0.3 * Math.sin(t * 0.5 + n.phase)
      const grd = ctx!.createRadialGradient(n.x * W, n.y * H, 0, n.x * W, n.y * H, Math.max(n.rx, n.ry) * pulse)
      grd.addColorStop(0, n.color)
      grd.addColorStop(1, 'rgba(0,0,0,0)')
      ctx!.fillStyle = grd
      ctx!.fillRect(0, 0, W, H)
    }

    // Central energy field
    const cPulse = 0.85 + 0.15 * Math.sin(t * 0.3)
    const cR = Math.min(W, H) * 0.4 * cPulse
    const cGrd = ctx!.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, cR)
    cGrd.addColorStop(0, 'rgba(99,102,241,0.035)')
    cGrd.addColorStop(0.5, 'rgba(59,130,246,0.015)')
    cGrd.addColorStop(1, 'rgba(0,0,0,0)')
    ctx!.fillStyle = cGrd
    ctx!.fillRect(0, 0, W, H)

    // Stars
    for (const s of stars) {
      s.x += s.vx; s.y += s.vy
      if (s.x < -10) s.x = W + 10; if (s.x > W + 10) s.x = -10
      if (s.y < -10) s.y = H + 10; if (s.y > H + 10) s.y = -10

      const dx = s.x - mouseX, dy = s.y - mouseY
      const md = Math.sqrt(dx * dx + dy * dy)
      if (md < 120 && md > 1) {
        const f = (1 - md / 120) * 0.6
        s.x += (dx / md) * f; s.y += (dy / md) * f
        s.o = Math.min(1, s.baseO + (1 - md / 120) * 0.3)
      } else {
        s.o += (s.baseO - s.o) * 0.05
      }

      const tw = 0.85 + 0.15 * Math.sin(t * 2 + s.x * 0.01 + s.y * 0.01)
      const alpha = s.o * tw

      if (s.r > 1.2) {
        const g = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3)
        g.addColorStop(0, `hsla(${s.hue},60%,80%,${alpha})`)
        g.addColorStop(0.4, `hsla(${s.hue},50%,70%,${alpha * 0.4})`)
        g.addColorStop(1, `hsla(${s.hue},40%,60%,0)`)
        ctx!.fillStyle = g
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.beginPath()
      ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx!.fillStyle = `hsla(${s.hue},50%,85%,${alpha})`
      ctx!.fill()
    }

    // Meteors
    ctx!.save()
    ctx!.globalCompositeOperation = 'lighter'
    ctx!.lineCap = 'round'
    for (const m of meteors) {
      if (m.delay > 0) {
        m.delay -= 1
        continue
      }

      m.life += 1
      m.x += m.speed * 1.9
      m.y += m.speed
      const fadeIn = Math.min(1, m.life / 45)
      const fadeOut = Math.max(0, 1 - (m.y - H * 0.52) / (H * 0.55))
      m.alpha = Math.min(0.32, fadeIn * fadeOut * 0.28)

      const tailX = m.x - m.len
      const tailY = m.y - m.len * 0.52
      const g = ctx!.createLinearGradient(tailX, tailY, m.x, m.y)
      g.addColorStop(0, `hsla(${m.hue},85%,72%,0)`)
      g.addColorStop(0.55, `hsla(${m.hue},85%,74%,${m.alpha * 0.45})`)
      g.addColorStop(1, `hsla(${m.hue},95%,88%,${m.alpha})`)
      ctx!.strokeStyle = g
      ctx!.lineWidth = 1
      ctx!.beginPath()
      ctx!.moveTo(tailX, tailY)
      ctx!.lineTo(m.x, m.y)
      ctx!.stroke()

      ctx!.beginPath()
      ctx!.arc(m.x, m.y, 1.1, 0, Math.PI * 2)
      ctx!.fillStyle = `hsla(${m.hue},95%,88%,${m.alpha * 0.9})`
      ctx!.fill()

      if (m.x > W + m.len || m.y > H + m.len || m.alpha <= 0 && m.life > 80) {
        resetMeteor(m)
      }
    }
    ctx!.restore()

    // Constellation lines
    ctx!.lineWidth = 0.4
    const bright = stars.filter(s => s.layer > 0.5)
    for (let i = 0; i < bright.length; i++) {
      for (let j = i + 1; j < bright.length; j++) {
        const ddx = bright[i].x - bright[j].x, ddy = bright[i].y - bright[j].y
        const d = Math.sqrt(ddx * ddx + ddy * ddy)
        if (d < 100) {
          ctx!.beginPath()
          ctx!.moveTo(bright[i].x, bright[i].y)
          ctx!.lineTo(bright[j].x, bright[j].y)
          ctx!.strokeStyle = `rgba(148,163,184,${0.035 * (1 - d / 100)})`
          ctx!.stroke()
        }
      }
    }

    rafId = requestAnimationFrame(draw)
  }
  draw()

  window.addEventListener('resize', resize)
  ;(canvas as any).__cleanup = () => {
    cancelAnimationFrame(rafId)
    parent.removeEventListener('mousemove', onMove)
    parent.removeEventListener('mouseleave', onLeave)
    window.removeEventListener('resize', resize)
  }
}

onMounted(init)
onUnmounted(() => { (canvasRef.value as any)?.__cleanup?.() })
</script>

<style scoped>
.particle-bg {
  position: absolute; inset: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 0;
}
</style>
