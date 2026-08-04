/**
 * 全局配置
 *
 * DeepSeek API Key 安全说明：
 * - 前端无法真正隐藏 API Key（浏览器需要真实 Key 才能调用）
 * - 这里采用两层保护：
 *   1. Key 以 XOR 混淆码存储（防止肉眼/普通查看，并非真正的加密）
 *   2. 支持 VITE_DEEPSEEK_API_KEY 环境变量覆盖（推荐：通过 GitHub Actions Secrets 注入）
 * - 最安全的做法是使用后端代理转发（如 Cloudflare Worker / 自有服务器）
 */

// XOR 混淆密钥
const OBFUSCATE_KEY = 'BYZM'

// 混淆后的 Key 字符码（由原始 Key 与 OBFUSCATE_KEY 逐字符 XOR 得到）
const OBFUSCATED_CODES = [
  49, 50, 119, 40, 117, 104, 111, 46, 118, 58, 107, 120, 116, 108, 60, 121, 113, 56, 63, 47,
  117, 109, 62, 47, 113, 107, 62, 41, 114, 60, 98, 125, 32, 105, 106
]

// 解码混淆 Key；优先使用环境变量（更安全，可被 GitHub Actions Secrets 注入）
function resolveApiKey() {
  const envKey =
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.VITE_DEEPSEEK_API_KEY) ||
    ''
  if (envKey) return envKey
  return OBFUSCATED_CODES.map((c, i) =>
    String.fromCharCode(c ^ OBFUSCATE_KEY.charCodeAt(i % OBFUSCATE_KEY.length))
  ).join('')
}

// 视觉 AI（智谱 GLM-4V）Key 混淆码
const VISION_OBFUSCATED_CODES = [
  115, 61, 56, 41, 116, 110, 110, 40, 116, 108, 109, 124, 118, 61, 63, 124, 35, 58, 60, 40, 112,
  63, 62, 116, 114, 96, 106, 120, 116, 111, 105, 43, 108, 48, 46, 57, 48, 23, 43, 123, 122, 32,
  19, 12, 13, 106, 20, 37, 19
]

// 解码视觉 Key；优先使用环境变量 VITE_VISION_API_KEY
function resolveVisionKey() {
  const envKey =
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.VITE_VISION_API_KEY) ||
    ''
  if (envKey) return envKey
  return VISION_OBFUSCATED_CODES.map((c, i) =>
    String.fromCharCode(c ^ OBFUSCATE_KEY.charCodeAt(i % OBFUSCATE_KEY.length))
  ).join('')
}

export default {
  deepseek: {
    apiKey: resolveApiKey(),
    baseURL: 'https://api.deepseek.com',
    model: 'deepseek-chat'
  },
  // 图片识别 AI（智谱 GLM-4V）
  // 流程：用户上传图片 → GLM-4V 识别内容 → 结果发给 DeepSeek 生成反馈
  // 模型可选：glm-4v-flash（免费快速）/ glm-4v / glm-4v-plus
  vision: {
    provider: 'zhipu',
    apiKey: resolveVisionKey(),
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'glm-4v-flash'
  }
}
