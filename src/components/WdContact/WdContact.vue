<template>
  <view class="wd-section" id="contact">
    <view class="section-inner">
      <view class="section-head">
        <text class="section-title">{{ t('contact.title') }}</text>
        <view class="section-line"></view>
      </view>

      <view class="contact-body">
        <text class="contact-desc">{{ t('contact.desc') }}</text>

        <view class="contact-cards">
          <view class="contact-card" @click="copyEmail">
            <view class="cc-icon mail">
              <text>✉️</text>
            </view>
            <view class="cc-info">
              <text class="cc-label">{{ t('contact.email') }}</text>
              <text class="cc-value">{{ email }}</text>
            </view>
            <view class="cc-action">
              <text>⧉</text>
            </view>
          </view>

          <view class="contact-card" @click="openGithub">
            <view class="cc-icon github">
              <text>⌥</text>
            </view>
            <view class="cc-info">
              <text class="cc-label">{{ t('contact.github') }}</text>
              <text class="cc-value">{{ github }}</text>
            </view>
            <view class="cc-action">
              <text>↗</text>
            </view>
          </view>
        </view>

        <view class="contact-mail-btn" @click="sendMail">
          <text>{{ t('contact.send') }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const email = 'wdream@example.com'
const github = 'github.com/WDream-BYZM'

function copyEmail() {
  uni.setClipboardData({
    data: email,
    success: () => {
      uni.showToast({ title: t('contact.copy'), icon: 'success' })
    }
  })
}

function openGithub() {
  /* #ifdef H5 */
  window.open('https://' + github, '_blank')
  /* #endif */
  /* #ifndef H5 */
  uni.setClipboardData({
    data: 'https://' + github,
    success: () => uni.showToast({ title: t('contact.copy'), icon: 'success' })
  })
  /* #endif */
}

function sendMail() {
  /* #ifdef H5 */
  window.location.href = 'mailto:' + email
  /* #endif */
  /* #ifndef H5 */
  uni.showToast({ title: email, icon: 'none' })
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
  margin-bottom: 60rpx;

  .section-sub {
    color: #fda4af;
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
    background: linear-gradient(90deg, #f9a8d4, #fda4af);
  }
}

.contact-body {
  display: flex;
  flex-direction: column;
  align-items: center;

  .contact-desc {
    color: #a9b2c9;
    font-size: 16px;
    line-height: 1.8;
    text-align: center;
    max-width: 560px;
  }

  .contact-cards {
    width: 100%;
    max-width: 620px;
    margin-top: 50rpx;
    display: flex;
    flex-direction: column;
    gap: 24rpx;

    .contact-card {
      display: flex;
      align-items: center;
      padding: 30rpx 32rpx;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(249, 168, 212, 0.55);
        box-shadow: 0 12px 32px rgba(249, 168, 212, 0.15);
        transform: translateY(-3px);
      }

      .cc-icon {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        margin-right: 24rpx;

        &.mail {
          background: rgba(249, 168, 212, 0.18);
        }

        &.github {
          background: rgba(253, 164, 175, 0.15);
        }
      }

      .cc-info {
        flex: 1;
        display: flex;
        flex-direction: column;

        .cc-label {
          color: #8a93ab;
          font-size: 13px;
        }

        .cc-value {
          margin-top: 6rpx;
          color: #e8ecf7;
          font-size: 16px;
          font-weight: 600;
        }
      }

      .cc-action {
        text {
          color: #fbcfe8;
          font-size: 22px;
        }
      }
    }
  }

  .contact-mail-btn {
    margin-top: 50rpx;
    padding: 15px 44px;
    border-radius: 30px;
    background: linear-gradient(135deg, #ec4899, #db2777);
    box-shadow: 0 8px 24px rgba(249, 168, 212, 0.4);
    cursor: pointer;
    transition: all 0.25s ease;

    text {
      color: #fff;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(253, 164, 175, 0.45);
    }
  }
}
</style>
