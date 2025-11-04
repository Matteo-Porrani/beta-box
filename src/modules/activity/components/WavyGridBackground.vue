<template>
  <div class="wavy-grid-background">
    <canvas ref="canvas" class="wavy-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"

const canvas = ref(null)
let ctx = null
const time = 50 // Static time value for consistent wave pattern

const config = {
  gridSize: 30,
  waveAmplitude: 40,
  waveFrequency: 0.03,
  color: "#44403c", // stone-700
  lineWidth: 1,
  opacity: 0.4,
  glowStrength: 0
}

function initCanvas() {
  if (!canvas.value) return

  const canvasEl = canvas.value
  ctx = canvasEl.getContext("2d")

  // Set canvas size to window size
  resizeCanvas()

  // Draw static wavy grid
  drawWavyGrid()
}

function resizeCanvas() {
  if (!canvas.value) return

  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight

  // Redraw after resize
  drawWavyGrid()
}

function drawWavyGrid() {
  if (!ctx || !canvas.value) return

  const width = canvas.value.width
  const height = canvas.value.height

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Set line style with glow effect
  ctx.shadowBlur = config.glowStrength
  ctx.shadowColor = config.color
  ctx.strokeStyle = config.color
  ctx.lineWidth = config.lineWidth
  ctx.globalAlpha = config.opacity

  const cols = Math.ceil(width / config.gridSize) + 1
  const rows = Math.ceil(height / config.gridSize) + 1

  // Draw vertical lines with irregular waves
  for (let i = 0; i < cols; i++) {
    ctx.beginPath()
    for (let j = 0; j < rows; j++) {
      const x = i * config.gridSize
      const y = j * config.gridSize

      // Multiple layered waves for irregular pattern
      const wave1 = Math.sin((y * 0.01 + time * 0.5)) * config.waveAmplitude
      const wave2 = Math.sin((y * 0.02 + time * 0.3 + i * 0.5)) * (config.waveAmplitude * 0.5)
      const wave3 = Math.cos((y * 0.015 + time * 0.4 + i * 0.3)) * (config.waveAmplitude * 0.7)
      const wave4 = Math.sin((y * 0.008 + time * 0.6)) * (config.waveAmplitude * 1.2)

      const waveX = wave1 + wave2 + wave3 + wave4
      const waveY = Math.cos((x * 0.01 + time * 0.35 + j * 0.2)) * (config.waveAmplitude * 0.3)

      const finalX = x + waveX
      const finalY = y + waveY

      if (j === 0) {
        ctx.moveTo(finalX, finalY)
      } else {
        ctx.lineTo(finalX, finalY)
      }
    }
    ctx.stroke()
  }

  // Draw horizontal lines with irregular waves
  for (let j = 0; j < rows; j++) {
    ctx.beginPath()
    for (let i = 0; i < cols; i++) {
      const x = i * config.gridSize
      const y = j * config.gridSize

      // Multiple layered waves for irregular pattern
      const wave1 = Math.sin((x * 0.01 + time * 0.5)) * config.waveAmplitude
      const wave2 = Math.cos((x * 0.02 + time * 0.3 + j * 0.5)) * (config.waveAmplitude * 0.6)
      const wave3 = Math.sin((x * 0.015 + time * 0.45 + j * 0.3)) * (config.waveAmplitude * 0.8)
      const wave4 = Math.cos((x * 0.008 + time * 0.55)) * (config.waveAmplitude * 1.3)

      const waveY = wave1 + wave2 + wave3 + wave4
      const waveX = Math.sin((y * 0.01 + time * 0.4 + i * 0.2)) * (config.waveAmplitude * 0.3)

      const finalX = x + waveX
      const finalY = y + waveY

      if (i === 0) {
        ctx.moveTo(finalX, finalY)
      } else {
        ctx.lineTo(finalX, finalY)
      }
    }
    ctx.stroke()
  }
}

onMounted(() => {
  initCanvas()
  window.addEventListener("resize", resizeCanvas)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeCanvas)
})
</script>

<style scoped>
.wavy-grid-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background: #1c1917;
}

.wavy-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
