<template>
  <view class="page">
    <WdNav />

    <view class="page-hero">
      <view class="back-btn" @click="goBack">
        <text>‹ 返回</text>
      </view>
      <text class="ph-title">{{ t('opensource.title') }}</text>
      <text class="ph-sub">{{ t('opensource.subtitle') }}</text>
    </view>

    <view class="page-body">
      <view class="os-layout">
        <!-- 灵动岛 · 电脑桌面视觉 -->
        <view class="os-visual">
          <view class="stage">
            <view class="wallpaper"></view>

            <!-- 折叠态胶囊：时间 + 天气 -->
            <view class="island-capsule">
              <text class="ic-time">9:41</text>
              <view class="ic-sep"></view>
              <view class="ic-weather"><text>☀️</text><text>26° 晴</text></view>
            </view>

            <!-- 展开态面板：导航 Tab + 总览内容 + 霓虹光晕 -->
            <view class="island-panel">
              <view class="island-tabs">
                <view class="island-tab active">总览</view>
                <view class="island-tab">AI</view>
                <view class="island-tab">翻译</view>
                <view class="island-tab">消息</view>
                <view class="island-tab">搜索</view>
                <view class="island-tab">天气</view>
                <view class="island-tab">计时</view>
                <view class="island-tab">状态</view>
                <view class="island-tab">设置</view>
                <view class="island-collapse"><text>✕</text></view>
              </view>

              <view class="island-content">
                <text class="ic-big-time">9:41</text>
                <text class="ic-date">{{ t('opensource.date') }}</text>
                <text class="ic-greet">下午好 👋</text>
                <view class="ic-widgets">
                  <view class="ic-w"><text class="icw-main">☀️ 26°</text><text class="icw-sub">晴 · 微风</text></view>
                  <view class="ic-w"><text class="icw-main">⏱ 05:00</text><text class="icw-sub">计时中</text></view>
                  <view class="ic-w"><text class="icw-main">💬 1 条</text><text class="icw-sub">新消息</text></view>
                </view>
              </view>
            </view>

            <!-- 任务栏 -->
            <view class="taskbar">
              <view class="tb-icon">🏠</view>
              <view class="tb-icon">📁</view>
              <view class="tb-icon">🌐</view>
              <view class="tb-icon">🎵</view>
              <view class="tb-icon">⚙️</view>
            </view>
          </view>
        </view>

        <!-- 项目信息 -->
        <view class="os-info">
          <view class="os-tag">{{ t('opensource.tag') }}</view>
          <view class="os-name">{{ t('opensource.name') }}</view>
          <view v-if="t('opensource.nameZh')" class="os-name-cn">{{ t('opensource.nameZh') }}</view>
          <view class="os-desc">{{ t('opensource.slogan') }}</view>

          <view class="os-modules">
            <view class="os-module" v-for="(m, i) in modules" :key="i">
              <view class="om-head">
                <view class="om-icon"><text>{{ modIcons[i] }}</text></view>
                <text class="om-name">{{ m.name }}</text>
              </view>
              <text class="om-desc">{{ m.desc }}</text>
            </view>
          </view>

          <view class="os-actions">
            <view class="btn-download" :class="{ muted: !canDownload }" @click="download">
              <text class="btn-ico">↓</text>
              <text>{{ t('opensource.download') }}</text>
            </view>
            <view class="btn-gh" @click="openGithub">
              <text>GitHub</text>
              <text class="btn-ico">↗</text>
            </view>
          </view>
          <view v-if="!canDownload" class="os-note">{{ t('opensource.soon') }}</view>
        </view>
      </view>
    </view>

    <WdFooter />
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import config from '../../config.js'

const { t, tm } = useI18n()

// 下载链接是否已配置（config.js → opensource.downloadUrl）
const canDownload = computed(() => !!config.opensource.downloadUrl)

const modIcons = ['🕐', '🤖', '🌐', '💬', '🔍', '⛅', '⏱', '🎵', '⚙️']

// tm() 返回结构化消息（对象数组）；t() 对数组/对象会返回空，故模块卡片必须用 tm()
const modules = computed(() => tm('opensource.modules'))

function goBack() {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/index/index' })
  }
}

function download() {
  if (!config.opensource.downloadUrl) {
    uni.showToast({ title: t('opensource.soon'), icon: 'none' })
    return
  }
  /* #ifdef H5 */
  window.open(config.opensource.downloadUrl, '_blank')
  /* #endif */
}

function openGithub() {
  if (!config.opensource.githubUrl) return
  /* #ifdef H5 */
  window.open(config.opensource.githubUrl, '_blank')
  /* #endif */
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

  .ph-sub {
    margin-top: 14rpx;
    color: #86868b;
    font-size: 14px;
    letter-spacing: 3px;
    font-weight: 600;
  }
}

.page-body {
  padding: 40rpx 40rpx 100rpx;
  max-width: 980px;
  margin: 0 auto;
}

.os-layout {
  display: flex;
  align-items: center;
  gap: 72rpx;

  @media (max-width: 860px) {
    flex-direction: column;
    gap: 56rpx;
  }
}

/* ---------- 灵动岛 · 电脑桌面视觉 ---------- */
.os-visual {
  flex: 1.2 1 0;
  min-width: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stage {
  position: relative;
  width: 100%;
  max-width: 620px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #0a0a0f;
  overflow: hidden;
  padding: 44px 24px 60px;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: stage-float 7s ease-in-out infinite;
}

@keyframes stage-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.wallpaper {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(80% 60% at 72% 18%, rgba(10, 132, 255, 0.28), transparent 62%),
    radial-gradient(70% 55% at 18% 82%, rgba(108, 92, 231, 0.22), transparent 62%),
    linear-gradient(160deg, #10101a 0%, #050508 100%);
}

/* 折叠态胶囊：时间 + 天气 */
.island-capsule {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 20px;
  border-radius: 999px;
  background: #0b0b0d;
  border: 1px solid rgba(255, 255, 255, 0.09);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55);
  color: #fff;

  .ic-time {
    font-family: 'SF Mono', 'Cascadia Code', Consolas, 'Courier New', monospace;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .ic-sep {
    width: 1px;
    height: 20px;
    background: rgba(255, 255, 255, 0.15);
  }

  .ic-weather {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.85);
  }
}

/* 展开态面板 */
.island-panel {
  position: relative;
  z-index: 2;
  width: min(520px, 100%);
  margin-top: 18px;
  border-radius: 26px;
  background: #15151a;
  padding: 16px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.65);

  /* 霓虹跑马灯描边（conic 六色循环） */
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 28px;
    padding: 2px;
    background: conic-gradient(#00d2ff, #c77dff, #7b68ee, #ff8fab, #2ecc71, #00d2ff);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    z-index: 0;
  }

  /* 呼吸泛光 */
  &::after {
    content: '';
    position: absolute;
    inset: -12px;
    border-radius: 36px;
    background: radial-gradient(60% 60% at 50% 50%, rgba(124, 77, 255, 0.35), transparent 70%);
    filter: blur(18px);
    z-index: -1;
    animation: breathe 2.6s ease-in-out infinite;
  }
}

@keyframes breathe {
  0%,
  100% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
}

/* 导航胶囊 Tab */
.island-tabs {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .island-tab {
    flex: none;
    padding: 7px 12px;
    border-radius: 999px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.62);
    background: rgba(255, 255, 255, 0.06);
    white-space: nowrap;

    &.active {
      color: #fff;
      font-weight: 700;
      background: linear-gradient(90deg, #00d2ff, #7b68ee, #ff8fab, #00d2ff);
      background-size: 300% 100%;
      animation: tab-flow 2.5s linear infinite;
      box-shadow: 0 0 14px rgba(124, 77, 255, 0.45);
    }
  }

  .island-collapse {
    flex: none;
    margin-left: auto;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    font-size: 11px;
  }
}

@keyframes tab-flow {
  from {
    background-position: 0% 0;
  }
  to {
    background-position: 300% 0;
  }
}

/* 总览内容 */
.island-content {
  position: relative;
  z-index: 1;
  margin-top: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  padding: 18px;

  .ic-big-time {
    display: block;
    font-family: 'SF Mono', 'Cascadia Code', Consolas, 'Courier New', monospace;
    font-size: 44px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.01em;
    line-height: 1;
  }

  .ic-date {
    display: block;
    margin-top: 10px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
  }

  .ic-greet {
    display: block;
    margin-top: 4px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 13px;
  }

  .ic-widgets {
    margin-top: 18px;
    display: flex;
    gap: 10px;

    .ic-w {
      flex: 1;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.07);
      padding: 12px 8px;
      text-align: center;

      .icw-main {
        display: block;
        color: rgba(255, 255, 255, 0.92);
        font-size: 13px;
        font-weight: 600;
      }

      .icw-sub {
        display: block;
        margin-top: 4px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 10px;
      }
    }
  }
}

/* 任务栏 */
.taskbar {
  position: absolute;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 12px;
  background: rgba(22, 22, 26, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
  z-index: 4;

  .tb-icon {
    width: 18px;
    height: 18px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
  }
}

/* 窄屏：任务栏弱化 */
@media (max-width: 520px) {
  .taskbar {
    opacity: 0.6;
  }
}

/* ---------- 项目信息 ---------- */
.os-info {
  flex: 1;
  min-width: 0;

  .os-tag {
    display: inline-block;
    padding: 8rpx 20rpx;
    border-radius: 999px;
    border: 1px solid rgba(10, 132, 255, 0.5);
    color: #0a84ff;
    font-size: 13px;
    font-weight: 600;
  }

  .os-name {
    margin-top: 24rpx;
    font-size: 40px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #f5f5f7;
  }

  .os-name-cn {
    margin-top: 8rpx;
    color: #86868b;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .os-desc {
    margin-top: 18rpx;
    color: #a1a1a6;
    font-size: 15px;
    line-height: 1.7;
    max-width: 480px;
  }

  .os-modules {
    margin-top: 34rpx;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 14rpx;

    .os-module {
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 14px;

      .om-head {
        display: flex;
        align-items: center;
        gap: 10rpx;

        .om-icon {
          flex: none;
          width: 22px;
          height: 22px;
          border-radius: 7px;
          background: rgba(10, 132, 255, 0.14);
          color: #0a84ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .om-name {
          color: #e8e8ed;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .om-desc {
        display: block;
        margin-top: 8rpx;
        color: #86868b;
        font-size: 12px;
        line-height: 1.5;
      }
    }
  }

  .os-actions {
    margin-top: 40rpx;
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;

    .btn-download {
      display: inline-flex;
      align-items: center;
      gap: 10rpx;
      padding: 18rpx 36rpx;
      border-radius: 14px;
      background: #0a84ff;
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.2s ease;

      .btn-ico {
        font-size: 17px;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 28px rgba(10, 132, 255, 0.35);
      }

      &:active {
        transform: translateY(0);
      }

      &.muted {
        background: #2c2c2e;
        color: #86868b;
        cursor: default;

        &:hover {
          transform: none;
          box-shadow: none;
        }
      }
    }

    .btn-gh {
      display: inline-flex;
      align-items: center;
      gap: 10rpx;
      padding: 18rpx 30rpx;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.14);
      color: #d2d2d7;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease, transform 0.15s ease;

      .btn-ico {
        font-size: 15px;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
      }
    }
  }

  .os-note {
    margin-top: 20rpx;
    color: #86868b;
    font-size: 13px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .stage {
    animation: none;
  }
  .island-panel::after,
  .island-tabs .island-tab.active {
    animation: none;
  }
}
</style>
