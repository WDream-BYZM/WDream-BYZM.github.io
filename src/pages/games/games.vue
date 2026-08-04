<template>
  <view class="page">
    <WdNav />

    <view class="page-hero">
      <view class="back-btn" @click="goBack">
        <text>← 返回</text>
      </view>
      <text class="ph-sub">{{ t('games.subtitle') }}</text>
      <text class="ph-title">{{ t('games.title') }}</text>
    </view>

    <view class="page-body">
      <WdGames />
    </view>

    <WdFooter />
  </view>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

function goBack() {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/index/index' })
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #0b0f1c;
}

.page-hero {
  padding: 160rpx 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;

  .back-btn {
    position: absolute;
    left: 40rpx;
    top: 120rpx;
    padding: 10px 22px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    cursor: pointer;
    transition: all 0.25s ease;

    text {
      color: #a9b2c9;
      font-size: 14px;
      font-weight: 600;
    }

    &:hover {
      border-color: rgba(108, 92, 231, 0.5);
      background: rgba(108, 92, 231, 0.15);

      text {
        color: #fff;
      }
    }
  }

  .ph-sub {
    color: #00d2ff;
    font-size: 13px;
    letter-spacing: 4px;
    font-weight: 600;
  }

  .ph-title {
    margin-top: 14rpx;
    font-size: 42px;
    font-weight: 800;
    color: #e8ecf7;
  }
}

.page-body {
  padding: 40rpx 40rpx 100rpx;
  max-width: 900px;
  margin: 0 auto;
}
</style>
