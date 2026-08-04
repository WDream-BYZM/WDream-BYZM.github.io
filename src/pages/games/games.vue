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
      <!-- 联机对战 · 开房间 -->
      <view class="multi-panel">
        <view class="mp-glow"></view>
        <view class="mp-head">
          <view class="mp-icon">🎮</view>
          <view class="mp-head-text">
            <view class="mp-title">{{ t('games.multi.title') }}</view>
            <view class="mp-sub">{{ t('games.multi.subtitle') }}</view>
          </view>
        </view>
        <view class="mp-desc">{{ t('games.multi.desc') }}</view>

        <view class="mp-row">
          <view class="mp-field">
            <text class="mp-label">{{ t('games.multi.game') }}</text>
            <picker :range="gameOptions" @change="onGameChange">
              <view class="mp-select">{{ gameOptions[gameIdx] }} ▾</view>
            </picker>
          </view>
          <view class="mp-field">
            <text class="mp-label">{{ t('games.multi.players') }}</text>
            <picker :range="playerOptions" @change="onPlayerChange">
              <view class="mp-select">{{ playerOptions[playerIdx] }} ▾</view>
            </picker>
          </view>
        </view>

        <view class="mp-row">
          <view class="mp-field grow">
            <text class="mp-label">{{ t('games.multi.nickname') }}</text>
            <input
              class="mp-input"
              v-model="nickname"
              :placeholder="t('games.multi.nicknamePh')"
              maxlength="12"
            />
          </view>
        </view>

        <view class="mp-row mp-actions">
          <view class="btn-create" @click="createRoom">{{ t('games.multi.create') }}</view>
          <view class="mp-join-box">
            <input
              class="mp-input join-input"
              v-model="roomInput"
              :placeholder="t('games.multi.roomPh')"
              maxlength="4"
            />
            <view class="btn-join" @click="joinRoom">{{ t('games.multi.join') }}</view>
          </view>
        </view>
      </view>

      <view class="games-sep"></view>

      <WdGames />
    </view>

    <WdFooter />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const gameOptions = [t('games.multi.gameTetris')]
const playerOptions = ['2 人', '3 人', '4 人']
const gameIdx = ref(0)
const playerIdx = ref(2)
const nickname = ref(localStorage.getItem('byzm_name') || '')
const roomInput = ref('')

function onGameChange(e) {
  gameIdx.value = +e.detail.value
}

function onPlayerChange(e) {
  playerIdx.value = +e.detail.value
}

function checkName() {
  if (!nickname.value.trim()) {
    uni.showToast({ title: t('games.multi.needName'), icon: 'none' })
    return false
  }
  localStorage.setItem('byzm_name', nickname.value.trim())
  return true
}

function createRoom() {
  if (!checkName()) return
  const room = String(Math.floor(1000 + Math.random() * 9000))
  const max = [2, 3, 4][playerIdx.value]
  goMulti(room, max)
}

function joinRoom() {
  if (!checkName()) return
  const room = roomInput.value.trim()
  if (!/^\d{4}$/.test(room)) {
    uni.showToast({ title: t('games.multi.needRoom'), icon: 'none' })
    return
  }
  const max = [2, 3, 4][playerIdx.value]
  goMulti(room, max)
}

function goMulti(room, max) {
  const name = encodeURIComponent(nickname.value.trim())
  /* #ifdef H5 */
  window.location.href = `/legacy/multi/index.html?game=tetris&room=${room}&max=${max}&name=${name}`
  /* #endif */
}

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

/* 联机对战面板 */
.multi-panel {
  position: relative;
  padding: 40rpx 36rpx;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;

  .mp-glow {
    position: absolute;
    top: -70px;
    right: -70px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(108, 92, 231, 0.4), rgba(0, 210, 255, 0.4));
    filter: blur(34px);
    opacity: 0.55;
    pointer-events: none;
  }

  .mp-head {
    display: flex;
    align-items: center;
    gap: 18rpx;

    .mp-icon {
      width: 68rpx;
      height: 68rpx;
      border-radius: 18rpx;
      background: linear-gradient(135deg, #6c5ce7, #00d2ff);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 34rpx;
      box-shadow: 0 8px 20px rgba(108, 92, 231, 0.35);
    }

    .mp-head-text {
      display: flex;
      flex-direction: column;

      .mp-title {
        color: #e8ecf7;
        font-size: 22px;
        font-weight: 800;
      }

      .mp-sub {
        margin-top: 2rpx;
        color: #00d2ff;
        font-size: 11px;
        letter-spacing: 4px;
        font-weight: 600;
      }
    }
  }

  .mp-desc {
    margin-top: 18rpx;
    color: #8a93ab;
    font-size: 14px;
    line-height: 1.7;
  }

  .mp-row {
    margin-top: 26rpx;
    display: flex;
    gap: 22rpx;
    align-items: flex-end;
    flex-wrap: wrap;

    .mp-field {
      flex: 1 1 200px;
      display: flex;
      flex-direction: column;
      gap: 10rpx;

      &.grow {
        flex: 1 1 100%;
      }

      .mp-label {
        color: #8a93ab;
        font-size: 13px;
        font-weight: 600;
      }

      .mp-select {
        padding: 18rpx 22rpx;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #e8ecf7;
        font-size: 15px;
        cursor: pointer;
        transition: border-color 0.25s ease;

        &:hover {
          border-color: rgba(0, 210, 255, 0.5);
        }
      }

      .mp-input {
        padding: 18rpx 22rpx;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #e8ecf7;
        font-size: 15px;
      }
    }
  }

  .mp-actions {
    align-items: center;

    .btn-create {
      padding: 18rpx 44rpx;
      border-radius: 14px;
      background: linear-gradient(135deg, #6c5ce7, #00d2ff);
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      transition: transform 0.15s ease, box-shadow 0.25s ease;
      box-shadow: 0 10px 24px rgba(108, 92, 231, 0.3);

      &:active {
        transform: scale(0.96);
      }

      &:hover {
        box-shadow: 0 14px 30px rgba(0, 210, 255, 0.35);
      }
    }

    .mp-join-box {
      flex: 1 1 300px;
      display: flex;
      gap: 14rpx;
      align-items: center;

      .join-input {
        flex: 1;
      }

      .btn-join {
        padding: 18rpx 36rpx;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.14);
        color: #00d2ff;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.25s ease;

        &:hover {
          border-color: rgba(0, 210, 255, 0.6);
          background: rgba(0, 210, 255, 0.12);
        }
      }
    }
  }
}

.games-sep {
  height: 40rpx;
}
</style>
