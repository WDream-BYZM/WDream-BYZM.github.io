<template>
  <view class="wd-footer">
    <view class="footer-inner">
      <view class="footer-brand">
        <view class="brand-logo"><text>B</text></view>
        <text class="brand-name">BYZM</text>
      </view>
      <text class="copyright">{{ t('footer.copyright') }}</text>
      <text class="powered">{{ t('footer.powered') }}</text>
      <text class="version">v{{ version }}</text>
    </view>
  </view>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import pkg from '../../../package.json'

const { t } = useI18n()
const version = pkg.version
</script>

<style lang="scss" scoped>
.wd-footer {
  padding: 60rpx 40rpx;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: #090c16;
}

.footer-inner {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;

  /* #ifdef H5 */
  max-width: 900px;
  /* #endif */
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;

  .brand-logo {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, #6c5ce7, #00d2ff);
    display: flex;
    align-items: center;
    justify-content: center;

    text {
      color: #fff;
      font-weight: 800;
      font-size: 18px;
    }
  }

  .brand-name {
    color: #e8ecf7;
    font-size: 17px;
    font-weight: 700;
  }
}

.copyright {
  color: #8a93ab;
  font-size: 14px;
}

.powered {
  color: #5b6478;
  font-size: 12px;
  letter-spacing: 1px;
}

.version {
  color: #3d445c;
  font-size: 12px;
  letter-spacing: 1px;
  font-family: 'SF Mono', 'Consolas', monospace;
}
</style>
