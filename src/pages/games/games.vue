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
        <view v-if="isDisabled" class="mp-maintenance">🔧 {{ t('games.multi.maintenance') }}</view>

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
          <view class="btn-create" :class="{ disabled: isDisabled }" @click="createRoom">{{ t('games.multi.create') }}</view>
          <view class="mp-join-box">
            <input
              class="mp-input join-input"
              v-model="roomInput"
              :placeholder="t('games.multi.roomPh')"
              maxlength="4"
            />
            <view class="btn-join" :class="{ disabled: isDisabled }" @click="joinRoom">{{ t('games.multi.join') }}</view>
          </view>
        </view>
      </view>

      <!-- 在线房间列表：均为 PeerJS P2P -->
      <view v-if="gameIdx === 0" class="rooms-panel">
        <view class="rooms-head">
          <view class="rooms-title">🛰️ {{ t('games.multi.roomsTetrisTitle') }}</view>
          <view class="rooms-sub">{{ t('games.multi.roomsTetrisSub') }}</view>
        </view>
        <view class="rooms-empty">{{ t('games.multi.peerDesc') }}</view>
      </view>

      <!-- 飞行棋：PeerJS P2P 说明 -->
      <view v-else class="rooms-panel">
        <view class="rooms-head">
          <view class="rooms-title">🛰️ {{ t('games.multi.roomsAirplaneTitle') }}</view>
          <view class="rooms-sub">{{ t('games.multi.roomsAirplaneSub') }}</view>
        </view>
        <view class="rooms-empty">{{ t('games.multi.peerDesc') }}</view>
      </view>

      <view class="games-sep"></view>

      <WdGames />
    </view>

    <WdFooter />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 俄罗斯方块联机（PeerJS P2P 直连）：无需服务器，启用
const TETRIS_ENABLED = true

// 飞行棋联机（PeerJS P2P 直连）：无需服务器，启用
const FLIGHT_ENABLED = true

const gameOptions = [t('games.multi.gameTetris'), t('games.multi.gameAirplane')]
const playerOptions = ['2 人', '3 人', '4 人']
const gameIdx = ref(1)
const playerIdx = ref(2)

// 当前所选游戏联机是否可用（不可用则禁用按钮并提示维护）
const isDisabled = computed(() => (gameIdx.value === 0 ? !TETRIS_ENABLED : !FLIGHT_ENABLED))
const nickname = ref(localStorage.getItem('byzm_name') || '')
const roomInput = ref('')

function joinRoomByCode(room) {
  if (isDisabled.value) {
    uni.showToast({ title: t('games.multi.maintenance'), icon: 'none' })
    return
  }
  if (!checkName()) return
  const max = [2, 3, 4][playerIdx.value]
  goMulti(room, max, 'join')
}

onMounted(() => {
  // 预留：页面挂载初始化
})

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
  if (isDisabled.value) {
    uni.showToast({ title: t('games.multi.maintenance'), icon: 'none' })
    return
  }
  if (!checkName()) return
  const room = String(Math.floor(1000 + Math.random() * 9000))
  const max = [2, 3, 4][playerIdx.value]
  goMulti(room, max, 'create')
}

function joinRoom() {
  if (isDisabled.value) {
    uni.showToast({ title: t('games.multi.maintenance'), icon: 'none' })
    return
  }
  if (!checkName()) return
  const room = roomInput.value.trim()
  if (!/^\d{4}$/.test(room)) {
    uni.showToast({ title: t('games.multi.needRoom'), icon: 'none' })
    return
  }
  const max = [2, 3, 4][playerIdx.value]
  goMulti(room, max, 'join')
}

function goMulti(room, max, mode) {
  const name = encodeURIComponent(nickname.value.trim())
  /* #ifdef H5 */
  if (gameIdx.value === 1) {
    // 飞行棋：PeerJS P2P 联机（mode=create 房主 / mode=join 加入）
    window.location.href = `/legacy/airplane/index.html?mode=${mode}&room=${room}&max=${max}&name=${name}`
  } else {
    // 俄罗斯方块：PeerJS P2P 联机（mode=create 房主 / mode=join 加入）
    window.location.href = `/legacy/multi/index.html?mode=${mode}&game=tetris&room=${room}&max=${max}&name=${name}`
  }
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

  .mp-maintenance {
    margin-top: 16rpx;
    padding: 14rpx 18rpx;
    border-radius: 12px;
    background: rgba(246, 196, 69, 0.1);
    border: 1px solid rgba(246, 196, 69, 0.3);
    color: #f6c445;
    font-size: 13px;
    font-weight: 600;
  }

  .btn-create.disabled,
  .btn-join.disabled {
    opacity: 0.4;
    cursor: not-allowed;
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

/* 在线房间列表 */
.rooms-panel {
  margin-top: 28rpx;
  padding: 36rpx;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);

  .rooms-head {
    display: flex;
    flex-direction: column;

    .rooms-title {
      color: #e8ecf7;
      font-size: 18px;
      font-weight: 800;
    }

    .rooms-sub {
      margin-top: 4rpx;
      color: #00d2ff;
      font-size: 11px;
      letter-spacing: 4px;
      font-weight: 600;
    }
  }

  .rooms-empty {
    margin-top: 22rpx;
    padding: 30rpx 0;
    text-align: center;
    color: #565d75;
    font-size: 14px;
  }

  .rooms-list {
    margin-top: 18rpx;
    display: flex;
    flex-direction: column;
    gap: 14rpx;

    .room-row {
      display: flex;
      align-items: center;
      gap: 16rpx;
      padding: 18rpx 22rpx;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      cursor: pointer;
      transition: all 0.25s ease;

      &:hover {
        border-color: rgba(0, 210, 255, 0.5);
        background: rgba(0, 210, 255, 0.06);
      }

      .rr-left {
        display: flex;
        flex-direction: column;
        min-width: 150rpx;

        .rr-code {
          color: #00d2ff;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .rr-game {
          color: #8a93ab;
          font-size: 12px;
          margin-top: 2rpx;
        }
      }

      .rr-mid {
        flex: 1;
        display: flex;
        flex-direction: column;

        .rr-count {
          color: #e8ecf7;
          font-size: 14px;
          font-weight: 700;
        }

        .rr-players {
          margin-top: 4rpx;
          color: #565d75;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .btn-join-sm {
        padding: 12rpx 24rpx;
        border-radius: 12px;
        background: linear-gradient(135deg, #6c5ce7, #00d2ff);
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        white-space: nowrap;
      }
    }
  }
}
</style>
