<template>
  <view class="wd-section" id="about">
    <view class="section-inner">
      <view class="section-head">
        <text class="section-title">{{ t('about.title') }}</text>
        <view class="section-line"></view>
      </view>

      <view class="about-body">
        <view class="about-text">
          <text class="about-desc">{{ t('about.desc') }}</text>
        </view>
        <view class="about-stats">
          <view class="stat" v-for="s in stats" :key="s.label">
            <text class="stat-value">{{ s.value }}</text>
            <text class="stat-label">{{ s.label }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 关于我的关键数据（数字可按实际情况调整）
const stats = computed(() => [
  { value: '3', label: t('about.years') },
  { value: '12', label: t('about.projects') },
  { value: '5k', label: t('about.cups') },
  { value: '128', label: t('about.stars') }
])
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
  align-items: flex-start;
  margin-bottom: 60rpx;

  .section-title {
    font-size: 38px;
    font-weight: 800;
    color: #e8ecf7;
  }

  .section-line {
    margin-top: 20rpx;
    width: 60px;
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(90deg, #f9a8d4, #fda4af);
  }
}

.about-body {
  display: flex;
  gap: 60rpx;
  align-items: stretch;

  .about-text {
    flex: 1.2;
    display: flex;
    align-items: center;

    .about-desc {
      color: #8a93ab;
      font-size: 17px;
      line-height: 1.9;
      letter-spacing: 1px;
    }
  }

  .about-stats {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24rpx;

    .stat {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 40rpx 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10rpx;

      .stat-value {
        font-size: 40px;
        font-weight: 900;
        color: #e8ecf7;
        line-height: 1;
      }

      .stat-label {
        font-size: 13px;
        color: #8a93ab;
        letter-spacing: 2px;
      }
    }
  }
}

@media (max-width: 760px) {
  .about-body {
    flex-direction: column;
  }
}
</style>
