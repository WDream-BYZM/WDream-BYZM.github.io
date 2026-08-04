<template>
  <view class="wd-section" id="about">
    <view class="section-inner">
      <view class="section-head">
        <text class="section-sub">{{ t('about.subtitle') }}</text>
        <text class="section-title">{{ t('about.title') }}</text>
        <view class="section-line"></view>
      </view>

      <view class="about-body">
        <view class="about-text">
          <text class="about-desc">{{ t('about.desc') }}</text>
          <view class="about-tags">
            <view class="tag" v-for="tag in tags" :key="tag">
              <text>{{ tag }}</text>
            </view>
          </view>
        </view>

        <view class="about-stats">
          <view class="stat-card" v-for="stat in stats" :key="stat.key">
            <view class="stat-num">
              <text>{{ stat.value }}</text>
            </view>
            <view class="stat-label">
              <text>{{ stat.label }}</text>
            </view>
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

const tags = ['HTML5', 'CSS3', 'JavaScript', 'Vue3', 'uni-app', 'Pinia', 'Sass', 'Vite', 'Three.js']

const stats = computed(() => [
  { key: 'exp', value: t('stats.experience'), label: t('about.years') },
  { key: 'proj', value: t('stats.projects'), label: t('about.projects') },
  { key: 'coffee', value: t('stats.coffee'), label: t('about.cups') },
  { key: 'star', value: t('stats.stars'), label: t('about.stars') }
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
  gap: 50rpx;
}

.about-text {
  text-align: center;

  .about-desc {
    color: #a9b2c9;
    font-size: 17px;
    line-height: 1.9;
    letter-spacing: 0.5px;
  }

  .about-tags {
    margin-top: 34rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16rpx;

    .tag {
      padding: 8px 18px;
      border-radius: 20px;
      background: rgba(108, 92, 231, 0.12);
      border: 1px solid rgba(108, 92, 231, 0.3);

      text {
        color: #a29bfe;
        font-size: 13px;
        font-weight: 600;
      }
    }
  }
}

.about-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;

  .stat-card {
    flex: 1;
    min-width: 140px;
    padding: 34rpx 20rpx;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
    text-align: center;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-6px);
      border-color: rgba(108, 92, 231, 0.5);
      box-shadow: 0 12px 30px rgba(108, 92, 231, 0.15);
    }

    .stat-num {
      text {
        font-size: 42px;
        font-weight: 800;
        background: linear-gradient(135deg, #a29bfe, #00d2ff);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
    }

    .stat-label {
      margin-top: 10rpx;

      text {
        color: #8a93ab;
        font-size: 14px;
        letter-spacing: 1px;
      }
    }
  }
}
</style>
