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
  { key: 'ai', label: t('nav.ai') },
  { key: 'contact', label: t('nav.contact') }
])

function scrollTo(key) {
  activeKey.value = key
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
  let current = 'home'
  for (const s of sections.value) {
    const el = document.getElementById(s.key)
    if (el && el.offsetTop <= top + 180) current = s.key
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
      background: linear-gradient(135deg, rgba(108, 92, 231, 0.95), rgba(0, 210, 255, 0.9));
      white-space: nowrap;
      box-shadow: 0 6px 18px rgba(108, 92, 231, 0.4);
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
      background: linear-gradient(90deg, #6c5ce7, #00d2ff);
      box-shadow: 0 0 12px rgba(0, 210, 255, 0.7);
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
