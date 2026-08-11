<template>
  <view class="page">
    <WdNav />

    <view class="page-hero">
      <view class="back-btn" @click="goBack">
        <text>‹ 返回</text>
      </view>
      <text class="ph-title">{{ t('games.title') }}</text>
    </view>

    <view class="page-body">
      <!-- 联机对战 · 开房间 -->
      <view class="multi-panel">
        <view class="mp-head">
          <view class="mp-icon">🎮</view>
          <view class="mp-head-text">
            <view class="mp-title">{{ t('games.multi.title') }}</view>
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
        </view>
        <view class="rooms-empty">{{ t('games.multi.peerDesc') }}</view>
      </view>

      <!-- 飞行棋：PeerJS P2P 说明 -->
      <view v-else class="rooms-panel">
        <view class="rooms-head">
          <view class="rooms-title">🛰️ {{ t('games.multi.roomsAirplaneTitle') }}</view>
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

/* 联机对战面板 */
.multi-panel {
  position: relative;
  padding: 32px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;

  .mp-head {
    display: flex;
    align-items: center;
    gap: 18rpx;

    .mp-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .mp-head-text {
      display: flex;
      flex-direction: column;

      .mp-title {
        color: #f5f5f7;
        font-size: 22px;
        font-weight: 800;
        letter-spacing: -0.01em;
      }
    }
  }

  .mp-desc {
    margin-top: 12px;
    color: #98989d;
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
        color: #98989d;
        font-size: 13px;
        font-weight: 600;
      }

      .mp-select {
        padding: 13px 16px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.14);
        color: #f5f5f7;
        font-size: 15px;
        cursor: pointer;
        transition: border-color 0.2s ease;

        &:hover {
          border-color: rgba(10, 132, 255, 0.5);
        }
      }

      .mp-input {
        padding: 13px 16px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.14);
        color: #f5f5f7;
        font-size: 15px;
      }
    }
  }

  .mp-actions {
    align-items: center;

    .btn-create {
      padding: 13px 36px;
      border-radius: 12px;
      background: #0a84ff;
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      transition: transform 0.12s ease-out, background 0.15s ease;
      box-shadow: 0 8px 24px rgba(10, 132, 255, 0.3);

      &:active {
        background: #0070e0;
        transform: scale(0.97);
      }

      &:hover {
        background: #2b8cff;
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
        padding: 13px 30px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.16);
        color: #0a84ff;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s ease, border-color 0.15s ease;

        &:hover {
          border-color: rgba(10, 132, 255, 0.5);
          background: rgba(10, 132, 255, 0.1);
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
  padding: 28px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);

  .rooms-head {
    display: flex;
    flex-direction: column;

    .rooms-title {
      color: #f5f5f7;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.01em;
    }
  }

  .rooms-empty {
    margin-top: 22rpx;
    padding: 30rpx 0;
    text-align: center;
    color: #6e6e73;
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
        border-color: rgba(10, 132, 255, 0.4);
        background: rgba(10, 132, 255, 0.06);
      }

      .rr-left {
        display: flex;
        flex-direction: column;
        min-width: 150rpx;

        .rr-code {
          color: #0a84ff;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 4px;
        }

        .rr-game {
          color: #98989d;
          font-size: 12px;
          margin-top: 2rpx;
        }
      }

      .rr-mid {
        flex: 1;
        display: flex;
        flex-direction: column;

        .rr-count {
          color: #f5f5f7;
          font-size: 14px;
          font-weight: 700;
        }

        .rr-players {
          margin-top: 4rpx;
          color: #6e6e73;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .btn-join-sm {
        padding: 10px 22px;
        border-radius: 10px;
        background: #0a84ff;
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        white-space: nowrap;
        cursor: pointer;
      }
    }
  }
}
</style>
