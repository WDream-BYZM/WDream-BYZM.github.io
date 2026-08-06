<template>
  <view class="wd-nav" :class="{ 'is-scrolled': scrolled }">
    <view class="nav-inner">
      <view class="brand" @click="scrollTo('top')">
        <view class="brand-logo"><text>B</text></view>
        <text class="brand-name">BYZM</text>
      </view>

      <view class="nav-menu">
        <view
          v-for="item in menus"
          :key="item.key"
          class="nav-item"
          :class="{ active: activeKey === item.key }"
          @click="scrollTo(item.key)"
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
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const scrolled = ref(false)
const activeKey = ref('home')

const menus = computed(() => [
  { key: 'home', label: t('nav.home') },
  { key: 'about', label: t('nav.about') },
  { key: 'features', label: t('nav.features') },
  { key: 'contact', label: t('nav.contact') }
])

function currentRoute() {
  const pages = getCurrentPages()
  const cur = pages[pages.length - 1]
  return cur ? cur.route : ''
}

function toggleLang() {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
}

function scrollTo(key) {
  activeKey.value = key
  if (key === 'top') {
    if (currentRoute() === 'pages/index/index') {
      /* #ifdef H5 */
      window.scrollTo({ top: 0, behavior: 'smooth' })
      /* #endif */
      /* #ifndef H5 */
      uni.pageScrollTo({ scrollTop: 0, duration: 400 })
      /* #endif */
    } else {
      uni.reLaunch({ url: '/pages/index/index' })
    }
    return
  }
  /* #ifdef H5 */
  const el = document.getElementById(key)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    // 不在首页：先回首页再滚动到目标板块
    uni.reLaunch({ url: '/pages/index/index' })
    setTimeout(() => {
      const target = document.getElementById(key)
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 400)
  }
  /* #endif */
  /* #ifndef H5 */
  if (currentRoute() === 'pages/index/index') {
    uni.pageScrollTo({ selector: `#${key}`, duration: 400 })
  } else {
    uni.reLaunch({
      url: '/pages/index/index',
      success: () => {
        setTimeout(() => uni.pageScrollTo({ selector: `#${key}`, duration: 400 }), 300)
      }
    })
  }
  /* #endif */
}

let pageScrollHandler = null

function handleScroll(top) {
  scrolled.value = top > 30
  // 根据各板块位置同步导航高亮
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
  // 滚动到底部时激活最后一个板块
  if (
    window.innerHeight + top >=
    (document.documentElement.scrollHeight || 0) - 10
  ) {
    current = 'contact'
  }
  activeKey.value = current
}

onMounted(() => {
  /* #ifdef H5 */
  pageScrollHandler = () => {
    handleScroll(window.pageYOffset || document.documentElement.scrollTop || 0)
  }
  window.addEventListener('scroll', pageScrollHandler, { passive: true })
  handleScroll(window.pageYOffset || 0)
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
    background: linear-gradient(135deg, #ec4899, #db2777);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    box-shadow: 0 4px 14px rgba(249, 168, 212, 0.5);

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
      background: linear-gradient(135deg, rgba(249, 168, 212, 0.25), rgba(253, 164, 175, 0.25));

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
      border-color: #fda4af;
      background: rgba(253, 164, 175, 0.1);

      text {
        color: #fda4af;
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

/* H5 小屏适配 */
@media (max-width: 768px) {
  .nav-inner {
    padding: 0 12px;
    height: 54px;
  }
  .brand-logo {
    width: 32px;
    height: 32px;
    margin-right: 6px;

    text {
      font-size: 16px;
    }
  }
  .brand-name {
    font-size: 15px;
  }
  .nav-menu {
    gap: 2px;
  }
  .nav-item {
    padding: 6px 8px;

    text {
      font-size: 13px;
    }
  }
  .lang-switch {
    padding: 4px 10px;

    text {
      font-size: 12px;
    }
  }
}
</style>
