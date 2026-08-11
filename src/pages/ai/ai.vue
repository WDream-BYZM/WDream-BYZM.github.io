<template>
  <view class="page">
    <WdNav />

    <view class="page-hero">
      <view class="back-btn" @click="goBack">
        <text>‹ 返回</text>
      </view>
      <text class="ph-title">{{ t('ai.title') }}</text>
    </view>

    <view class="page-body">
      <WdAI />
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
  background: #000;
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
    left: 24px;
    top: 110px;
    padding: 10px 14px;
    border-radius: 10px;
    cursor: pointer;
    transition: opacity 0.15s ease;

    text {
      color: #0a84ff;
      font-size: 16px;
      font-weight: 600;
    }

    &:active {
      opacity: 0.55;
    }
  }

  .ph-title {
    font-size: 42px;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: #f5f5f7;
  }
}

.page-body {
  padding: 40rpx 40rpx 100rpx;
  max-width: 900px;
  margin: 0 auto;
}
</style>
