<template>
  <view class="wd-hero" id="home">
    <!-- Three.js 3D 粒子特效背景（H5） -->
    <view ref="heroRef" class="three-stage"></view>

    <!-- 动态光晕 / 网格 / 扫描线光效 -->
    <view class="bg-orb orb-1"></view>
    <view class="bg-orb orb-2"></view>
    <view class="bg-grid"></view>
    <view class="scanline"></view>

    <!-- 品牌文字（霓虹流光特效） -->
    <view class="hero-content">
      <view class="brand-title">
        <text
          v-for="(ch, i) in brandLetters"
          :key="i"
          class="b-letter"
          :style="{ animationDelay: i * 0.12 + 's' }"
          >{{ ch }}</text
        >
      </view>

      <view class="brand-sub">
        <text>{{ t('hero.slogan') }}</text>
      </view>

      <view class="hero-actions">
        <view class="btn btn-primary" @click="scrollTo('games')">
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

// #ifdef H5
import * as THREE from 'three'
// #endif

const { t } = useI18n()

// 品牌字母（B-Y-Z-M），逐个展示
const brandLetters = computed(() => (t('hero.name') || 'BYZM').split(''))

const heroRef = ref(null)

function scrollTo(key) {
  /* #ifdef H5 */
  const el = document.getElementById(key)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  /* #endif */
  /* #ifndef H5 */
  uni.pageScrollTo({ selector: `#${key}`, duration: 400 })
  /* #endif */
}

// ---------- Three.js 3D 粒子星空（H5） ----------
/* #ifdef H5 */
let renderer = null
let scene = null
let camera = null
let points = null
let rafId = null
let resizeHandler = null

function initThree() {
  // uniapp 中 view 的 ref 可能是组件实例，用 $el 获取真实 DOM
  const refEl = heroRef.value
  const container = refEl ? refEl.$el || refEl.el || refEl : null
  if (!container || !container.appendChild) return
  const width = container.clientWidth || window.innerWidth
  const height = container.clientHeight || window.innerHeight

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000)
  camera.position.z = 6

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  // 彩色粒子云（紫 → 青 渐变）
  const count = 2000
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const c1 = new THREE.Color(0x6c5ce7)
  const c2 = new THREE.Color(0x00d2ff)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18
    positions[i * 3 + 1] = (Math.random() - 0.5) * 18
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18
    const c = c1.clone().lerp(c2, Math.random())
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  points = new THREE.Points(geometry, material)
  scene.add(points)

  animate()
}

function animate() {
  rafId = requestAnimationFrame(animate)
  if (points) {
    points.rotation.y += 0.0012
    points.rotation.x += 0.0006
  }
  if (renderer) renderer.render(scene, camera)
}

function onResize() {
  const refEl = heroRef.value
  const container = refEl ? refEl.$el || refEl.el || refEl : null
  if (!container || !renderer || !camera) return
  const width = container.clientWidth || window.innerWidth
  const height = container.clientHeight || window.innerHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}
/* #endif */

onMounted(() => {
  /* #ifdef H5 */
  setTimeout(() => {
    initThree()
    resizeHandler = () => onResize()
    window.addEventListener('resize', resizeHandler)
  }, 120)
  /* #endif */
})

onUnmounted(() => {
  /* #ifdef H5 */
  if (rafId) cancelAnimationFrame(rafId)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  if (renderer) {
    renderer.dispose()
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }
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
  background: #05070d;
}

/* Three.js 粒子舞台 */
.three-stage {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;

  :deep(canvas) {
    display: block;
  }
}

/* 动态光晕 */
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

/* 扫描线光效 */
.scanline {
  position: absolute;
  left: 0;
  right: 0;
  top: -140px;
  height: 140px;
  background: linear-gradient(180deg, transparent, rgba(0, 210, 255, 0.05), transparent);
  animation: scan 7s linear infinite;
  pointer-events: none;
  z-index: 2;
}

@keyframes scan {
  to {
    top: 110vh;
  }
}

/* 中央内容 */
.hero-content {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 30rpx;
}

/* 霓虹流光品牌名 */
.brand-title {
  display: flex;
  align-items: center;

  .b-letter {
    font-size: 120px;
    font-weight: 900;
    line-height: 1;
    letter-spacing: 8px;
    background: linear-gradient(
      180deg,
      #ffffff 0%,
      #a29bfe 35%,
      #00d2ff 70%,
      #6c5ce7 100%
    );
    background-size: 100% 220%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: drop-shadow(0 0 22px rgba(108, 92, 231, 0.65))
      drop-shadow(0 0 60px rgba(0, 210, 255, 0.35));
    opacity: 0;
    animation: letterPop 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards,
      hueDrift 5s ease-in-out infinite alternate;
  }
}

@keyframes letterPop {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.7) rotateX(45deg);
    filter: blur(14px) drop-shadow(0 0 10px rgba(108, 92, 231, 0.8));
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0);
    filter: blur(0) drop-shadow(0 0 22px rgba(108, 92, 231, 0.65))
      drop-shadow(0 0 60px rgba(0, 210, 255, 0.35));
  }
}

@keyframes hueDrift {
  from {
    filter: drop-shadow(0 0 22px rgba(108, 92, 231, 0.7))
      drop-shadow(0 0 60px rgba(0, 210, 255, 0.4));
  }
  to {
    filter: drop-shadow(0 0 26px rgba(0, 210, 255, 0.8))
      drop-shadow(0 0 70px rgba(108, 92, 231, 0.5));
  }
}

/* 副标题 */
.brand-sub {
  margin-top: 34rpx;
  padding: 0 24rpx;

  text {
    color: #8a93ab;
    font-size: 16px;
    letter-spacing: 4px;
    opacity: 0;
    animation: fadeUp 0.8s ease 0.6s forwards;
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 按钮 */
.hero-actions {
  margin-top: 64rpx;
  display: flex;
  gap: 24rpx;
  opacity: 0;
  animation: fadeUp 0.8s ease 0.9s forwards;

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
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -80%;
      width: 50%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
      transform: skewX(-20deg);
      animation: btnShine 2.8s ease-in-out infinite;
    }

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

@keyframes btnShine {
  0%,
  60% {
    left: -80%;
  }
  100% {
    left: 130%;
  }
}

/* 滚动提示 */
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

/* 移动端适配 */
@media (max-width: 600px) {
  .brand-title .b-letter {
    font-size: 64px;
    letter-spacing: 4px;
  }
}
</style>
