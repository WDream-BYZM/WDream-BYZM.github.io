<template>
  <view class="games-grid">
    <view
      class="game-card"
      v-for="game in games"
      :key="game.key"
      :class="{ playable: game.playable }"
      @click="openGame(game)"
    >
      <view class="card-glow"></view>
      <view class="card-top">
        <view class="card-icon" :style="{ background: game.gradient }">
          <text>{{ game.emoji }}</text>
        </view>
        <view class="card-status" :class="{ playing: game.playable }">
          <text>{{ game.playable ? '▶' : '···' }}</text>
        </view>
      </view>
      <view class="card-body">
        <text class="card-name">{{ game.name }}</text>
        <text class="card-desc">{{ game.desc }}</text>
      </view>
      <view class="card-footer">
        <text>{{ game.playable ? t('games.play') : t('games.soon') }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const games = computed(() => [
  {
    key: 'tetris',
    emoji: '🎮',
    name: t('games.items.tetris.name'),
    desc: t('games.items.tetris.desc'),
    gradient: 'linear-gradient(135deg, #6c5ce7, #00d2ff)',
    playable: true,
    url: '/legacy/tetris/index.html'
  },
  {
    key: 'snake',
    emoji: '🐍',
    name: t('games.items.snake.name'),
    desc: t('games.items.snake.desc'),
    gradient: 'linear-gradient(135deg, #00d2ff, #7b68ee)',
    playable: true,
    url: '/legacy/snake/index.html'
  },
  {
    key: 'g2048',
    emoji: '🔢',
    name: t('games.items.g2048.name'),
    desc: t('games.items.g2048.desc'),
    gradient: 'linear-gradient(135deg, #7b68ee, #ff6b9d)',
    playable: false,
    url: ''
  },
  {
    key: 'airplane',
    emoji: '✈️',
    name: t('games.items.airplane.name'),
    desc: t('games.items.airplane.desc'),
    gradient: 'linear-gradient(135deg, #ff6b9d, #00d2ff)',
    playable: true,
    url: '/legacy/airplane/index.html'
  },
  {
    key: 'jump',
    emoji: '🦘',
    name: t('games.items.jump.name'),
    desc: t('games.items.jump.desc'),
    gradient: 'linear-gradient(135deg, #00d2ff, #ff6b9d)',
    playable: true,
    url: '/legacy/jump/index.html'
  },
  {
    key: 'nes',
    emoji: '🕹️',
    name: t('games.items.nes.name'),
    desc: t('games.items.nes.desc'),
    gradient: 'linear-gradient(135deg, #6c5ce7, #ff6b9d)',
    playable: true,
    url: '/legacy/nes/index.html'
  }
])

function openGame(game) {
  if (!game.playable || !game.url) {
    uni.showToast({ title: t('games.soon'), icon: 'none' })
    return
  }
  /* #ifdef H5 */
  // 当前页跳转到游戏（避免 window.open 被浏览器弹窗拦截）
  window.location.href = game.url
  /* #endif */
  /* #ifndef H5 */
  uni.showToast({ title: game.name, icon: 'none' })
  /* #endif */
}
</script>

<style lang="scss" scoped>
.games-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 28rpx;

  .game-card {
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

    &.playable:hover {
      border-color: rgba(0, 210, 255, 0.7);
      box-shadow: 0 18px 44px rgba(0, 210, 255, 0.25);
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

      .card-status {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.06);
        display: flex;
        align-items: center;
        justify-content: center;

        text {
          font-size: 14px;
          color: #8a93ab;
        }

        &.playing {
          background: rgba(0, 210, 255, 0.15);
          animation: pulse 2s ease infinite;

          text {
            color: #00d2ff;
          }
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

    &.playable .card-footer text {
      color: #00d2ff;
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(0, 210, 255, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(0, 210, 255, 0);
  }
}
</style>
