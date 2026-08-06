<template>
  <view class="wd-section" id="about">
    <view class="section-inner">
      <view class="section-head">
        <text class="section-sub">{{ t('about.subtitle') }}</text>
        <text class="section-title">{{ t('about.title') }}</text>
        <view class="section-line"></view>
      </view>

      <view class="about-body">
        <text class="about-empty">{{ t('about.empty') }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.wd-section {
  padding: 120rpx 40rpx;
}

.section-inner {
  max-width: 1000px;
  margin: 0 auto;

  /* #ifdef H5 */
  max-width: 900px;
  /* #endif */
}

.section-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 70rpx;

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

.about-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;

  .about-empty {
    color: #5b6478;
    font-size: 16px;
    letter-spacing: 3px;
  }
}
</style>
