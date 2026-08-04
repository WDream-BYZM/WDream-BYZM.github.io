<template>
  <view class="wd-nav" :class="{ 'is-scrolled': scrolled || !isHome }">
    <view class="nav-inner">
      <view class="brand" @click="goHome">
        <view class="brand-logo"><text>B</text></view>
        <text class="brand-name">BYZM</text>
      </view>

      <view class="nav-menu">
        <view
          v-for="item in menus"
          :key="item.key"
          class="nav-item"
          :class="{ active: activeKey === item.key }"
          @click="navigateTo(item)"
        >
          <text>{{ item.label }}</text>
        </view>
      </view>

      <view class="nav-actions">
        <view class="lang-switch" @click="toggleLang">
          <text>{{ locale === 'zh-CN' ? 'EN' : '中文' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const scrolled = ref(false)
const isHome = ref(false)
const activeKey = ref('home')

const menus = computed(() => [
  { key: 'home', label: t('nav.home'), path: '/pages/index/index' },
  { key: 'about', label: t('nav.about'), path: '/pages/about/about' },
  { key: 'games', label: t('nav.games'), path: '/pages/games/games' },
  { key: 'ai', label: t('nav.ai'), path: '/pages/ai/ai' },
  { key: 'contact', label: t('nav.contact'), path: '/pages/contact/contact' }
])

function currentRoute() {
  const pages = getCurrentPages()
  const cur = pages[pages.length - 1]
  return cur ? cur.route : ''
}

function navigateTo(item) {
  if (currentRoute() === item.path.replace(/^\//, '')) return // 已在当前页
  activeKey.value = item.key
  if (item.key === 'home') {
    uni.reLaunch({ url: item.path })
  } else {
    uni.navigateTo({ url: item.path })
  }
}

function goHome() {
  if (currentRoute() !== 'pages/index/index') {
    uni.reLaunch({ url: '/pages/index/index' })
  } else {
    uni.pageScrollTo({ scrollTop: 0, duration: 300 })
  }
}

function toggleLang() {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
}

function updateActive() {
  const route = currentRoute()
  isHome.value = route === 'pages/index/index'
  const match = menus.value.find((m) => m.path.replace(/^\//, '') === route)
  if (match) activeKey.value = match.key
}

let pageScrollHandler = null

function handleScroll(top) {
  scrolled.value = top > 30
}

onShow(() => {
  updateActive()
})

onMounted(() => {
  updateActive()
  /* #ifdef H5 */
  pageScrollHandler = () => {
    handleScroll(window.pageYOffset || document.documentElement.scrollTop || 0)
  }
  window.addEventListener('scroll', pageScrollHandler, { passive: true })
  /* #endif */
  /* #ifndef H5 */
  pageScrollHandler = (res) => handleScroll(res.scrollTop)
  try {
    uni.onPageScroll(pageScrollHandler)
  } catch (e) {}
  /* #endif */
})

onUnmounted(() => {
  /* #ifdef H5 */
  if (pageScrollHandler) window.removeEventListener('scroll', pageScrollHandler)
  /* #endif */
  /* #ifndef H5 */
  try {
    uni.offPageScroll(pageScrollHandler)
  } catch (e) {}
  /* #endif */
})
</script>

<style lang="scss" scoped>
.wd-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  background: transparent;

  &.is-scrolled {
    background: rgba(11, 15, 28, 0.82);
    backdrop-filter: blur(14px);
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.35);
  }
}

.nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 40rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  /* #ifdef H5 */
  padding: 0 32px;
  height: 64px;
  /* #endif */
}

.brand {
  display: flex;
  align-items: center;
  cursor: pointer;

  .brand-logo {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, #6c5ce7, #00d2ff);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    box-shadow: 0 4px 14px rgba(108, 92, 231, 0.5);

    text {
      color: #fff;
      font-weight: 800;
      font-size: 20px;
    }
  }

  .brand-name {
    color: #e8ecf7;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 6px;

  .nav-item {
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.25s ease;

    text {
      color: #a9b2c9;
      font-size: 15px;
      transition: color 0.25s ease;
    }

    &:hover text {
      color: #fff;
    }

    &.active {
      background: linear-gradient(135deg, rgba(108, 92, 231, 0.25), rgba(0, 210, 255, 0.25));

      text {
        color: #fff;
        font-weight: 600;
      }
    }
  }
}

.nav-actions {
  .lang-switch {
    padding: 6px 14px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.25s ease;

    text {
      color: #c9d1e5;
      font-size: 13px;
      font-weight: 600;
    }

    &:hover {
      border-color: #00d2ff;
      background: rgba(0, 210, 255, 0.1);

      text {
        color: #00d2ff;
      }
    }
  }
}

/* 移动端隐藏文字菜单，仅保留品牌与语言切换 */
/* #ifndef H5 */
.nav-menu {
  display: none;
}
/* #endif */
</style>
