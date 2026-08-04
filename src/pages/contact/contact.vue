<template>
  <view class="page">
    <WdNav />

    <view class="page-hero">
      <text class="ph-sub">{{ t('contact.subtitle') }}</text>
      <text class="ph-title">{{ t('contact.title') }}</text>
    </view>

    <WdContact />

    <WdFooter />
  </view>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
</style>
