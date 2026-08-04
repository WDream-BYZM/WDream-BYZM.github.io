<template>
  <view class="page">
    <WdNav />
    <WdHero />

    <!-- 页面入口引导 -->
    <view class="home-nav">
      <view class="home-title">
        <text>EXPLORE</text>
      </view>
      <view class="home-cards">
        <view class="home-card" @click="go('/pages/about/about')">
          <text class="hc-icon">👤</text>
          <text class="hc-name">{{ t('nav.about') }}</text>
          <text class="hc-arrow">→</text>
        </view>
        <view class="home-card" @click="go('/pages/games/games')">
          <text class="hc-icon">🎮</text>
          <text class="hc-name">{{ t('nav.games') }}</text>
          <text class="hc-arrow">→</text>
        </view>
        <view class="home-card" @click="go('/pages/ai/ai')">
          <text class="hc-icon">🤖</text>
          <text class="hc-name">{{ t('nav.ai') }}</text>
          <text class="hc-arrow">→</text>
        </view>
        <view class="home-card" @click="go('/pages/contact/contact')">
          <text class="hc-icon">📬</text>
          <text class="hc-name">{{ t('nav.contact') }}</text>
          <text class="hc-arrow">→</text>
        </view>
      </view>
    </view>

    <WdFooter />
  </view>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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

.home-nav {
  padding: 80rpx 40rpx 120rpx;

  .home-title {
    text-align: center;
    margin-bottom: 50rpx;

    text {
      color: #8a93ab;
      font-size: 14px;
      letter-spacing: 6px;
      font-weight: 600;
    }
  }

  .home-cards {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    gap: 28rpx;

    .home-card {
      flex: 1 1 200px;
      display: flex;
      align-items: center;
      gap: 16rpx;
      padding: 34rpx 30rpx;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        border-color: rgba(108, 92, 231, 0.55);
        box-shadow: 0 12px 32px rgba(108, 92, 231, 0.18);
      }

      .hc-icon {
        font-size: 30px;
      }

      .hc-name {
        flex: 1;
        color: #e8ecf7;
        font-size: 17px;
        font-weight: 700;
      }

      .hc-arrow {
        color: #a29bfe;
        font-size: 20px;
      }
    }
  }
}
</style>
