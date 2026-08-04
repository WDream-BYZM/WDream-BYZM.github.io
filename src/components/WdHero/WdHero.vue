<template>
  <view class="wd-hero" id="home">
    <!-- 装饰背景 -->
    <view class="bg-orb orb-1"></view>
    <view class="bg-orb orb-2"></view>
    <view class="bg-grid"></view>

    <!-- 粒子（H5 端 Canvas） -->
    <!-- #ifdef H5 -->
    <canvas class="particle-canvas" :canvas-id="canvasId" :id="canvasId"></canvas>
    <!-- #endif -->

    <view class="hero-content">
      <view class="avatar">
        <view class="avatar-ring">
          <view class="avatar-core"><text>W</text></view>
        </view>
      </view>

      <view class="hello">
        <text>{{ t('hero.hello') }}</text>
      </view>
      <view class="name">
        <text>{{ t('hero.name') }}</text>
      </view>
      <view class="typewriter">
        <text class="tw-prefix">&lt;</text>
        <text class="tw-text">{{ typedText }}</text>
        <text class="tw-cursor">|</text>
        <text class="tw-suffix">/&gt;</text>
      </view>

      <view class="slogan">
        <text>{{ t('hero.slogan') }}</text>
      </view>

      <view class="hero-actions">
        <view class="btn btn-primary" @click="scrollTo('projects')">
          <text>{{ t('hero.viewWork') }}</text>
        </view>
        <view class="btn btn-ghost" @click="scrollTo('contact')">
          <text>{{ t('hero.contactMe') }}</text>
        </view>
      </view>
    </view>

    <view class="scroll-hint">
      <view class="mouse"></view>
      <text>SCROLL</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

const canvasId = 'wdParticleCanvas'
const typedText = ref('')

// tm() 用于获取 messages 中的数组（typewriter 短语列表）
const typewriterWords = computed(() => tm('hero.typewriter'))

function scrollTo(key) {
  /* #ifdef H5 */
  const el = document.getElementById(key)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  /* #endif */
  /* #ifndef H5 */
  uni.pageScrollTo({ selector: `#${key}`, duration: 400 })
  /* #endif */
}

// ---------- 打字机效果（跨端可用） ----------
let timer = null
let wordIndex = 0
let charIndex = 0
let deleting = false

function typeLoop() {
  const words = typewriterWords.value
  const word = words[wordIndex % words.length]

  if (!deleting) {
    charIndex++
    typedText.value = word.slice(0, charIndex)
    if (charIndex === word.length) {
      deleting = true
      timer = setTimeout(typeLoop, 1600)
      return
    }
    timer = setTimeout(typeLoop, 120)
  } else {
    charIndex--
    typedText.value = word.slice(0, charIndex)
    if (charIndex === 0) {
      deleting = false
      wordIndex++
      timer = setTimeout(typeLoop, 400)
      return
    }
    timer = setTimeout(typeLoop, 60)
  }
}

// ---------- 粒子背景（H5 Canvas） ----------
/* #ifdef H5 */
let ctx = null
let particles = []
let rafId = null

function initParticles() {
  // uniapp H5 中 canvas 组件渲染为 uni-canvas 包裹的原生 canvas，用 canvas[canvas-id] 获取
  const canvas = document.querySelector(`canvas[canvas-id="${canvasId}"]`)
  if (!canvas) return
  const host = canvas.closest('.wd-hero') || canvas.parentElement
  const width = host ? host.clientWidth : window.innerWidth
  const height = host ? host.clientHeight : window.innerHeight
  canvas.width = width * 2
  canvas.height = height * 2
  ctx = canvas.getContext('2d')
  ctx.scale(2, 2)
  particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 2.2 + 0.6,
    c: Math.random() > 0.5 ? 'rgba(108,92,231,' : 'rgba(0,210,255,'
  }))
  drawParticles()
}

function drawParticles() {
  if (!ctx) return
  const canvas = document.querySelector(`canvas[canvas-id="${canvasId}"]`)
  if (!canvas) return
  const width = canvas.width / 2
  const height = canvas.height / 2
  ctx.clearRect(0, 0, width, height)
  particles.forEach((p) => {
    p.x += p.vx
    p.y += p.vy
    if (p.x < 0 || p.x > width) p.vx *= -1
    if (p.y < 0 || p.y > height) p.vy *= -1
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = p.c + (0.4 + Math.random() * 0.4) + ')'
    ctx.fill()
  })
  rafId = requestAnimationFrame(drawParticles)
}
/* #endif */

onMounted(() => {
  timer = setTimeout(typeLoop, 600)
  /* #ifdef H5 */
  setTimeout(() => initParticles(), 100)
  /* #endif */
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
  /* #ifdef H5 */
  if (rafId) cancelAnimationFrame(rafId)
  /* #endif */
})
</script>

<style lang="scss" scoped>
.wd-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 140rpx 40rpx 80rpx;
  background: linear-gradient(160deg, #0b0f1c 0%, #121a33 55%, #0e1526 100%);
}

/* 装饰光斑 */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  pointer-events: none;
}

.orb-1 {
  width: 480px;
  height: 480px;
  background: rgba(108, 92, 231, 0.55);
  top: -120px;
  left: -120px;
  animation: float 8s ease-in-out infinite;
}

.orb-2 {
  width: 420px;
  height: 420px;
  background: rgba(0, 210, 255, 0.4);
  bottom: -140px;
  right: -100px;
  animation: float 10s ease-in-out infinite reverse;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, -30px);
  }
}

/* 网格背景 */
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
  pointer-events: none;
}

.particle-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: fadeUp 0.9s ease both;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.avatar {
  margin-bottom: 36rpx;

  .avatar-ring {
    width: 148px;
    height: 148px;
    border-radius: 50%;
    padding: 5px;
    background: conic-gradient(from 0deg, #6c5ce7, #00d2ff, #7b68ee, #6c5ce7);
    animation: spin 6s linear infinite;

    .avatar-core {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(160deg, #1a2140, #0e1526);
      display: flex;
      align-items: center;
      justify-content: center;

      text {
        font-size: 56px;
        font-weight: 800;
        background: linear-gradient(135deg, #a29bfe, #00d2ff);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.hello {
  text {
    color: #8a93ab;
    font-size: 20px;
    letter-spacing: 2px;
  }
}

.name {
  margin-top: 12rpx;

  text {
    font-size: 56px;
    font-weight: 800;
    background: linear-gradient(135deg, #ffffff 0%, #a29bfe 60%, #00d2ff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: 2px;
  }
}

.typewriter {
  margin-top: 30rpx;
  display: flex;
  align-items: center;

  text {
    font-size: 26px;
    font-weight: 600;
  }

  .tw-prefix,
  .tw-suffix {
    color: #00d2ff;
    margin: 0 10rpx;
  }

  .tw-text {
    color: #a29bfe;
    min-height: 40px;
  }

  .tw-cursor {
    color: #00d2ff;
    margin-left: 6rpx;
    animation: blink 0.8s step-end infinite;
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.slogan {
  margin-top: 24rpx;

  text {
    color: #8a93ab;
    font-size: 17px;
    letter-spacing: 1px;
  }
}

.hero-actions {
  margin-top: 60rpx;
  display: flex;
  gap: 24rpx;

  .btn {
    padding: 16px 34px;
    border-radius: 30px;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.25s ease;

    text {
      color: #fff;
      font-weight: 600;
      letter-spacing: 1px;
    }
  }

  .btn-primary {
    background: linear-gradient(135deg, #6c5ce7, #00d2ff);
    box-shadow: 0 8px 24px rgba(108, 92, 231, 0.4);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(0, 210, 255, 0.45);
    }
  }

  .btn-ghost {
    border: 1px solid rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.04);

    &:hover {
      border-color: #a29bfe;
      background: rgba(108, 92, 231, 0.15);
      transform: translateY(-3px);
    }
  }
}

.scroll-hint {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.7;

  text {
    font-size: 10px;
    letter-spacing: 3px;
    color: #8a93ab;
  }

  .mouse {
    width: 22px;
    height: 34px;
    border: 2px solid #8a93ab;
    border-radius: 12px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 6px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 8px;
      border-radius: 2px;
      background: #00d2ff;
      animation: wheel 1.6s ease infinite;
    }
  }
}

@keyframes wheel {
  0% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, 12px);
  }
}
</style>
