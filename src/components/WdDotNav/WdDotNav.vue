<template>
  <view class="dot-nav" :class="{ hidden }">
    <view
      v-for="item in sections"
      :key="item.key"
      class="dot-item"
      :class="{ active: activeKey === item.key }"
      @click="scrollTo(item.key)"
      @mouseenter="hoverKey = item.key"
      @mouseleave="hoverKey = ''"
    >
      <view class="dot-bar"></view>
      <view class="dot-label" v-if="hoverKey === item.key">
        <text>{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const activeKey = ref('home')
const hoverKey = ref('')
// 首页（顶部）时隐藏目录
const hidden = ref(true)

const sections = computed(() => [
  { key: 'home', label: t('nav.home') },
  { key: 'about', label: t('nav.about') },
  { key: 'features', label: t('nav.features') },
  { key: 'contact', label: t('nav.contact') }
])

function scrollTo(key) {
  activeKey.value = key
  if (key === 'top' || key === 'home') {
    /* #ifdef H5 */
    window.scrollTo({ top: 0, behavior: 'smooth' })
    /* #endif */
    /* #ifndef H5 */
    uni.pageScrollTo({ scrollTop: 0, duration: 400 })
    /* #endif */
    return
  }
  /* #ifdef H5 */
  const el = document.getElementById(key)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  /* #endif */
  /* #ifndef H5 */
  uni.pageScrollTo({ selector: `#${key}`, duration: 400 })
  /* #endif */
}

let scrollHandler = null

function handleScroll(top) {
  // 首页区域（顶部约 300px 内）隐藏目录
  hidden.value = top < 300
  const map = [
    { key: 'about', id: 'about' },
    { key: 'features', id: 'features' },
    { key: 'contact', id: 'contact' }
  ]
  let current = 'home'
  for (const item of map) {
    const el = document.getElementById(item.id)
    if (el && el.offsetTop <= top + 160) current = item.key
  }
  if (window.innerHeight + top >= (document.documentElement.scrollHeight || 0) - 10) {
    current = 'contact'
  }
  activeKey.value = current
}

onMounted(() => {
  /* #ifdef H5 */
  scrollHandler = () => {
    handleScroll(window.pageYOffset || document.documentElement.scrollTop || 0)
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })
  /* #endif */
  /* #ifndef H5 */
  scrollHandler = (res) => handleScroll(res.scrollTop)
  try {
    uni.onPageScroll(scrollHandler)
  } catch (e) {}
  /* #endif */
})

onUnmounted(() => {
  /* #ifdef H5 */
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
  /* #endif */
  /* #ifndef H5 */
  try {
    uni.offPageScroll(scrollHandler)
  } catch (e) {}
  /* #endif */
})
</script>

<style lang="scss" scoped>
.dot-nav {
  position: fixed;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 998;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20px;
  transition: opacity 0.3s ease;

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .dot-item {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 6px 0;

    .dot-bar {
      width: 16px;
      height: 4px;
      border-radius: 2px;
      background: rgba(255, 255, 255, 0.28);
      transition: all 0.3s ease;
    }

    .dot-label {
      position: absolute;
      right: 32px;
      padding: 6px 14px;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(249, 168, 212, 0.95), rgba(253, 164, 175, 0.9));
      white-space: nowrap;
      box-shadow: 0 6px 18px rgba(249, 168, 212, 0.4);
      opacity: 0;
      pointer-events: none;
      transform: translateX(10px);
      transition: all 0.25s ease;

      text {
        color: #fff;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 1px;
      }
    }

    &:hover .dot-bar,
    &.active .dot-bar {
      width: 26px;
      background: linear-gradient(90deg, #f9a8d4, #fda4af);
      box-shadow: 0 0 12px rgba(253, 164, 175, 0.7);
    }

    &:hover .dot-label {
      opacity: 1;
      transform: translateX(0);
    }
  }
}

/* 小屏隐藏（移动端用顶部导航即可） */
@media (max-width: 768px) {
  .dot-nav {
    display: none;
  }
}
</style>
