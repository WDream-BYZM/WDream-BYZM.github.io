<template>
  <view class="wd-section" id="ai">
    <view class="section-inner">
      <view class="section-head">
        <text class="section-title">{{ t('ai.title') }}</text>
        <view class="section-line"></view>
      </view>

      <view class="chat-box">
        <scroll-view scroll-y class="chat-scroll" :scroll-into-view="scrollIntoView">
          <view
            v-for="(m, i) in messages"
            :id="'msg-' + i"
            :key="i"
            class="msg"
            :class="m.role"
          >
            <view class="msg-avatar" :class="m.role">
              <text>{{ m.role === 'user' ? 'ME' : 'AI' }}</text>
            </view>
            <view class="msg-bubble">
              <image v-if="m.image" class="msg-image" :src="m.image" mode="widthFix" />
              <text>{{ m.content }}</text>
              <view v-if="m.role === 'assistant' && i === messages.length - 1 && loading" class="typing">
                <text class="dot"></text>
                <text class="dot"></text>
                <text class="dot"></text>
              </view>
            </view>
          </view>
        </scroll-view>

        <view class="chat-input">
          <view class="img-btn" :class="{ disabled: loading || recognizing }" @click="onPickImage">
            <text>🖼️</text>
          </view>
          <input
            v-model="inputText"
            class="input-field"
            :placeholder="t('ai.placeholder')"
            :disabled="loading"
            confirm-type="send"
            @confirm="send"
          />
          <view class="send-btn" :class="{ disabled: loading }" @click="send">
            <text>{{ loading ? '···' : '➤' }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import config from '../../config.js'

const { t } = useI18n()

const messages = ref([{ role: 'assistant', content: t('ai.greeting') }])
const inputText = ref('')
const loading = ref(false)
const recognizing = ref(false)

const scrollIntoView = computed(() => 'msg-' + (messages.value.length - 1))

async function send() {
  const text = inputText.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'user', content: text })
  inputText.value = ''
  loading.value = true

  try {
    const reply = await requestDeepSeek(messages.value)
    messages.value.push({ role: 'assistant', content: reply })
  } catch (e) {
    messages.value.push({
      role: 'assistant',
      content: t('ai.error') + ' ' + (e.message || '')
    })
  } finally {
    loading.value = false
  }
}

// ---------- 图片识别：识别图片 → 发给 DeepSeek 反馈 ----------
async function onPickImage() {
  if (loading.value || recognizing.value) return
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    success: async (res) => {
      const path = res.tempFilePaths[0]
      messages.value.push({ role: 'user', content: t('ai.image'), image: path })
      recognizing.value = true
      try {
        const desc = await recognizeImage(path)
        // 识别结果作为上下文消息，让 DeepSeek 基于识别内容给用户反馈
        messages.value.push({ role: 'system', content: t('ai.visionPrefix') + desc })
        const reply = await requestDeepSeek(messages.value)
        messages.value.push({ role: 'assistant', content: reply })
      } catch (e) {
        messages.value.push({
          role: 'assistant',
          content: t('ai.error') + ' ' + (e.message || '')
        })
      } finally {
        recognizing.value = false
      }
    }
  })
}

// 图片识别：优先使用配置的视觉 AI（OpenAI 兼容）；未配置时返回占位说明
function recognizeImage(path) {
  const vision = config.vision
  if (!vision.apiKey || !vision.baseURL || !vision.model) {
    return Promise.resolve(t('ai.visionUnconfigured'))
  }
  return new Promise((resolve, reject) => {
    const requestVision = (base64) => {
      uni.request({
        url: `${vision.baseURL}/chat/completions`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${vision.apiKey}`
        },
        data: {
          model: vision.model,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: '请识别这张图片的内容，用简洁的语言描述' },
                { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } }
              ]
            }
          ]
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data && res.data.choices) {
            resolve(res.data.choices[0].message.content)
          } else {
            const msg =
              res.data && res.data.error ? res.data.error.message : `HTTP ${res.statusCode}`
            reject(new Error(msg))
          }
        },
        fail: (err) => reject(new Error(err.errMsg || 'vision error'))
      })
    }

    // #ifdef H5
    fetch(path)
      .then((r) => r.blob())
      .then((blob) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64 = String(reader.result).split(',')[1]
          requestVision(base64)
        }
        reader.onerror = () => reject(new Error('read image failed'))
        reader.readAsDataURL(blob)
      })
      .catch(() => reject(new Error('fetch image failed')))
    // #endif
    // #ifndef H5
    uni.getFileSystemManager().readFile({
      filePath: path,
      encoding: 'base64',
      success: (r) => requestVision(r.data),
      fail: () => reject(new Error('read image failed'))
    })
    // #endif
  })
}

function requestDeepSeek(msgs) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${config.deepseek.baseURL}/chat/completions`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.deepseek.apiKey}`
      },
      data: {
        model: config.deepseek.model,
        messages: msgs.map((m) => ({ role: m.role, content: m.content })),
        stream: false
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.choices) {
          resolve(res.data.choices[0].message.content)
        } else {
          const msg = res.data && res.data.error ? res.data.error.message : `HTTP ${res.statusCode}`
          reject(new Error(msg))
        }
      },
      fail: (err) => {
        reject(new Error(err.errMsg || 'network error'))
      }
    })
  })
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

  .section-title {
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: #f5f5f7;
  }

  .section-line {
    margin-top: 24rpx;
    width: 40px;
    height: 3px;
    border-radius: 2px;
    background: #0a84ff;
  }
}

.chat-box {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  overflow: hidden;

  .chat-scroll {
    height: 460px;
    padding: 30rpx 26rpx;
    box-sizing: border-box;

    .msg {
      display: flex;
      margin-bottom: 20px;
      align-items: flex-start;

      .msg-avatar {
        width: 34px;
        height: 34px;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.5px;

        &.assistant {
          background: #0a84ff;
          color: #fff;
          margin-right: 12px;
        }

        &.user {
          background: rgba(255, 255, 255, 0.1);
          color: #f5f5f7;
          margin-left: 12px;
        }
      }

      .msg-bubble {
        max-width: 78%;
        padding: 12px 16px;
        border-radius: 16px;
        font-size: 14px;
        line-height: 1.7;
        word-break: break-word;

        .msg-image {
          max-width: 220px;
          max-height: 220px;
          border-radius: 10px;
          margin-bottom: 8px;
          display: block;
        }

        text {
          color: #f5f5f7;
          white-space: pre-wrap;
        }

        .typing {
          display: inline-flex;
          gap: 5px;
          margin-top: 4px;

          .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #0a84ff;
            animation: blink 1.2s ease infinite;

            &:nth-child(2) {
              animation-delay: 0.2s;
            }

            &:nth-child(3) {
              animation-delay: 0.4s;
            }
          }
        }
      }

      &.assistant {
        .msg-bubble {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      }

      &.user {
        flex-direction: row-reverse;

        .msg-bubble {
          background: rgba(10, 132, 255, 0.16);
          border: 1px solid rgba(10, 132, 255, 0.3);
        }
      }
    }
  }

  .chat-input {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(0, 0, 0, 0.4);

    .img-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.15s ease;

      text {
        font-size: 20px;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .input-field {
      flex: 1;
      height: 44px;
      padding: 0 18px;
      border-radius: 22px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #f5f5f7;
      font-size: 14px;

      &:focus {
        border-color: rgba(10, 132, 255, 0.5);
      }
    }

    .send-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #0a84ff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.12s ease-out, background 0.15s ease;
      box-shadow: 0 6px 18px rgba(10, 132, 255, 0.4);

      text {
        color: #fff;
        font-size: 18px;
        font-weight: 700;
      }

      &:hover {
        background: #2b8cff;
      }

      &:active {
        background: #0070e0;
        transform: scale(0.94);
      }

      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }
    }
  }
}

@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0.2;
  }
  40% {
    opacity: 1;
  }
}
</style>
