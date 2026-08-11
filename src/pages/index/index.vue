<template>
  <view class="page">
    <WdNav />
    <WdDotNav />
    <WdHero />
    <WdAbout />

    <!-- 功能模块：游戏 / AI 聊天 入口 -->
    <view class="features" id="features">
      <view class="section-head">
        <text class="section-sub">FEATURES</text>
        <text class="section-title">{{ t('features.title') }}</text>
        <view class="section-line"></view>
      </view>
      <view class="feature-cards">
        <view class="feature-card" @click="go('/pages/games/games')">
          <text class="fc-emoji">🎮</text>
          <view class="fc-info">
            <text class="fc-name">{{ t('features.games') }}</text>
            <text class="fc-desc">{{ t('features.gamesDesc') }}</text>
          </view>
          <text class="fc-arrow">→</text>
        </view>
        <view class="feature-card" @click="go('/pages/ai/ai')">
          <text class="fc-emoji">🤖</text>
          <view class="fc-info">
            <text class="fc-name">{{ t('features.ai') }}</text>
            <text class="fc-desc">{{ t('features.aiDesc') }}</text>
          </view>
          <text class="fc-arrow">→</text>
        </view>
        <view class="feature-card" @click="go('/pages/opensource/opensource')">
          <text class="fc-emoji">📦</text>
          <view class="fc-info">
            <text class="fc-name">{{ t('features.opensource') }}</text>
            <text class="fc-desc">{{ t('features.opensourceDesc') }}</text>
          </view>
          <text class="fc-arrow">→</text>
        </view>
      </view>
    </view>

    <WdContact />
    <WdFooter />
  </view>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 板块滚动进入过渡：进入视口时淡入上移（H5；轮询等待元素渲染，最可靠）
if (typeof window !== 'undefined') {
  setTimeout(function () {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    var shown = {}
    var initialized = false
    var timer = setInterval(function () {
      var els = Array.prototype.slice.call(document.querySelectorAll('#about, #features, #contact'))
      if (!els.length) return // 页面尚未渲染完，下一轮再试
      if (!initialized) {
        initialized = true
        els.forEach(function (el) { el.classList.add('reveal-pre') })
      }
      var vh = window.innerHeight || document.documentElement.clientHeight
      els.forEach(function (el) {
        if (shown[el.id]) return
        var r = el.getBoundingClientRect()
        // 布局未完成时元素无尺寸，跳过避免误判
        if (!r.width && !r.height) return
        if (r.top < vh * 0.88) {
          el.classList.add('reveal-in')
          el.classList.remove('reveal-pre')
          shown[el.id] = true
        }
      })
      if (els.every(function (el) { return shown[el.id] })) {
        clearInterval(timer)
        timer = null
      }
    }, 500)
  }, 300)
}

function go(path) {
  uni.navigateTo({ url: path })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #0b0f1c;
  overflow-x: hidden;
}

.features {
  padding: 120rpx 40rpx;

  .section-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 60rpx;

    .section-sub {
      color: #00d2ff;
      font-size: 13px;
      letter-spacing: 4px;
      font-weight: 600;
    }

    .section-title {
      margin-top: 14rpx;
      font-size: 38px;
      font-weight: 800;
      color: #e8ecf7;
    }

    .section-line {
      margin-top: 20rpx;
      width: 60px;
      height: 4px;
      border-radius: 2px;
      background: linear-gradient(90deg, #6c5ce7, #00d2ff);
    }
  }

  .feature-cards {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    gap: 28rpx;

    .feature-card {
      flex: 1 1 260px;
      display: flex;
      align-items: center;
      gap: 20rpx;
      padding: 40rpx 36rpx;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-6px);
        border-color: rgba(108, 92, 231, 0.55);
        box-shadow: 0 14px 36px rgba(108, 92, 231, 0.2);
      }

      .fc-emoji {
        font-size: 40px;
      }

      .fc-info {
        flex: 1;
        display: flex;
        flex-direction: column;

        .fc-name {
          color: #e8ecf7;
          font-size: 19px;
          font-weight: 700;
        }

        .fc-desc {
          margin-top: 8rpx;
          color: #8a93ab;
          font-size: 13px;
        }
      }

      .fc-arrow {
        color: #a29bfe;
        font-size: 22px;
      }
    }
  }
}
</style>