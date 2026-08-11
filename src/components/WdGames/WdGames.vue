<template>
  <view class="games-grid">
    <view
      class="game-card"
      v-for="game in games"
      :key="game.key"
      :class="{ playable: game.playable }"
      @click="openGame(game)"
    >
      <view class="card-top">
        <view class="card-icon">
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
    playable: true,
    url: '/legacy/tetris/index.html'
  },
  {
    key: 'snake',
    emoji: '🐍',
    name: t('games.items.snake.name'),
    desc: t('games.items.snake.desc'),
    playable: true,
    url: '/legacy/snake/index.html'
  },
  {
    key: 'g2048',
    emoji: '🔢',
    name: t('games.items.g2048.name'),
    desc: t('games.items.g2048.desc'),
    playable: false,
    url: ''
  },
  {
    key: 'airplane',
    emoji: '✈️',
    name: t('games.items.airplane.name'),
    desc: t('games.items.airplane.desc'),
    playable: true,
    url: '/legacy/airplane/index.html'
  },
  {
    key: 'jump',
    emoji: '🦘',
    name: t('games.items.jump.name'),
    desc: t('games.items.jump.desc'),
    playable: true,
    url: '/legacy/jump/index.html'
  },
  {
    key: 'nes',
    emoji: '🕹️',
    name: t('games.items.nes.name'),
    desc: t('games.items.nes.desc'),
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
  gap: 16px;

  .game-card {
    position: relative;
    flex: 1 1 calc(33.333% - 11px);
    min-width: 240px;
    padding: 24px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.12s ease-out;

    &:hover {
      border-color: rgba(10, 132, 255, 0.45);
      background: rgba(255, 255, 255, 0.07);
    }

    &:active {
      transform: scale(0.98);
    }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .card-icon {
        width: 52px;
        height: 52px;
        border-radius: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .card-status {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.06);
        display: flex;
        align-items: center;
        justify-content: center;

        text {
          font-size: 12px;
          color: #6e6e73;
        }

        &.playing {
          background: rgba(10, 132, 255, 0.15);

          text {
            color: #0a84ff;
          }
        }
      }
    }

    .card-body {
      margin-top: 20px;
      display: flex;
      flex-direction: column;

      .card-name {
        color: #f5f5f7;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: -0.01em;
      }

      .card-desc {
        margin-top: 8px;
        color: #98989d;
        font-size: 14px;
        line-height: 1.6;
      }
    }

    .card-footer {
      margin-top: 18px;

      text {
        color: #6e6e73;
        font-size: 14px;
        font-weight: 600;
      }
    }

    &.playable .card-footer text {
      color: #0a84ff;
    }
  }
}
</style>
