<template>
  <view class="wd-section" id="projects">
    <view class="section-inner">
      <view class="section-head">
        <text class="section-sub">{{ t('projects.subtitle') }}</text>
        <text class="section-title">{{ t('projects.title') }}</text>
        <view class="section-line"></view>
      </view>

      <view class="projects-grid">
        <view
          class="project-card"
          v-for="project in projects"
          :key="project.key"
          @click="openProject(project)"
        >
          <view class="card-glow"></view>
          <view class="card-top">
            <view class="card-icon" :style="{ background: project.gradient }">
              <text>{{ project.emoji }}</text>
            </view>
            <view class="card-tag">
              <text>{{ project.tag }}</text>
            </view>
          </view>
          <view class="card-body">
            <text class="card-name">{{ project.name }}</text>
            <text class="card-desc">{{ project.desc }}</text>
          </view>
          <view class="card-footer">
            <text>{{ t('projects.view') }} →</text>
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

const projects = computed(() => [
  {
    key: 'tetris',
    emoji: '🎮',
    tag: t('projects.items.tetris.tag'),
    name: t('projects.items.tetris.name'),
    desc: t('projects.items.tetris.desc'),
    gradient: 'linear-gradient(135deg, #6c5ce7, #00d2ff)',
    url: '/legacy/tetris/index.html'
  },
  {
    key: 'homepage',
    emoji: '🖥️',
    tag: t('projects.items.homepage.tag'),
    name: t('projects.items.homepage.name'),
    desc: t('projects.items.homepage.desc'),
    gradient: 'linear-gradient(135deg, #00d2ff, #7b68ee)',
    url: ''
  },
  {
    key: 'ai',
    emoji: '🤖',
    tag: t('projects.items.ai.tag'),
    name: t('projects.items.ai.name'),
    desc: t('projects.items.ai.desc'),
    gradient: 'linear-gradient(135deg, #7b68ee, #ff6b9d)',
    url: ''
  }
])

function openProject(project) {
  if (!project.url) {
    uni.showToast({ title: '开发中...', icon: 'none' })
    return
  }
  /* #ifdef H5 */
  window.open(project.url, '_blank')
  /* #endif */
  /* #ifndef H5 */
  uni.showToast({ title: project.name, icon: 'none' })
  /* #endif */
}
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

.projects-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 28rpx;

  .project-card {
    position: relative;
    flex: 1 1 calc(33.333% - 19px);
    min-width: 240px;
    padding: 36rpx 32rpx;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.35s ease;

    &:hover {
      transform: translateY(-8px);
      border-color: rgba(108, 92, 231, 0.6);
      box-shadow: 0 18px 44px rgba(108, 92, 231, 0.22);
    }

    .card-glow {
      position: absolute;
      top: -60px;
      right: -60px;
      width: 160px;
      height: 160px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(108, 92, 231, 0.35), rgba(0, 210, 255, 0.35));
      filter: blur(30px);
      opacity: 0.5;
      transition: opacity 0.3s ease;
    }

    &:hover .card-glow {
      opacity: 0.9;
    }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .card-icon {
        width: 60px;
        height: 60px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        box-shadow: 0 8px 20px rgba(108, 92, 231, 0.3);
      }

      .card-tag {
        padding: 4px 12px;
        border-radius: 14px;
        background: rgba(0, 210, 255, 0.12);
        border: 1px solid rgba(0, 210, 255, 0.3);

        text {
          font-size: 12px;
          color: #00d2ff;
          font-weight: 600;
        }
      }
    }

    .card-body {
      margin-top: 28rpx;
      display: flex;
      flex-direction: column;

      .card-name {
        color: #e8ecf7;
        font-size: 19px;
        font-weight: 700;
      }

      .card-desc {
        margin-top: 12rpx;
        color: #8a93ab;
        font-size: 14px;
        line-height: 1.7;
      }
    }

    .card-footer {
      margin-top: 26rpx;

      text {
        color: #a29bfe;
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
}
</style>
