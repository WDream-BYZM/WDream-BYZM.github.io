<template>
  <view class="wd-section" id="skills">
    <view class="section-inner">
      <view class="section-head">
        <text class="section-sub">{{ t('skills.subtitle') }}</text>
        <text class="section-title">{{ t('skills.title') }}</text>
        <view class="section-line"></view>
      </view>

      <view class="skills-grid">
        <view class="skill-card" v-for="skill in skills" :key="skill.name">
          <view class="skill-top">
            <text class="skill-name">{{ skill.name }}</text>
            <text class="skill-percent">{{ skill.level }}%</text>
          </view>
          <view class="skill-bar">
            <view class="skill-fill" :style="{ width: skill.level + '%' }"></view>
          </view>
          <text class="skill-tag">{{ skill.tag }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const skills = [
  { name: 'HTML5 / CSS3', level: 90, tag: '基础' },
  { name: 'JavaScript / ES6+', level: 88, tag: '核心' },
  { name: 'Vue 3', level: 85, tag: '框架' },
  { name: 'uni-app', level: 82, tag: '跨端' },
  { name: 'Pinia / Vuex', level: 80, tag: '状态' },
  { name: 'Sass / SCSS', level: 86, tag: '样式' },
  { name: 'Vite / 构建', level: 78, tag: '工具' },
  { name: 'Three.js', level: 70, tag: '3D' }
]
</script>

<style lang="scss" scoped>
.wd-section {
  padding: 120rpx 40rpx;
  background: linear-gradient(180deg, rgba(21, 26, 44, 0.6), rgba(11, 15, 28, 0));
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

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;

  .skill-card {
    flex: 1 1 calc(50% - 12px);
    min-width: 240px;
    padding: 34rpx 30rpx;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(0, 210, 255, 0.5);
      box-shadow: 0 12px 30px rgba(0, 210, 255, 0.1);
      transform: translateY(-4px);
    }

    .skill-top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .skill-name {
        color: #e8ecf7;
        font-size: 16px;
        font-weight: 600;
      }

      .skill-percent {
        color: #00d2ff;
        font-size: 15px;
        font-weight: 700;
      }
    }

    .skill-bar {
      margin-top: 18rpx;
      height: 8px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.08);
      overflow: hidden;

      .skill-fill {
        height: 100%;
        border-radius: 4px;
        background: linear-gradient(90deg, #6c5ce7, #00d2ff);
        transition: width 1.2s ease;
      }
    }

    .skill-tag {
      display: inline-block;
      margin-top: 16rpx;
      font-size: 12px;
      color: #8a93ab;
    }
  }
}
</style>
