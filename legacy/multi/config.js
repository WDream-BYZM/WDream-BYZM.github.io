// ============================================================
// 联机对战 —— 服务器地址配置
// 方案二（Cloudflare Worker）：部署后把下面 wsUrl 换成你的地址
// 方案四（Node 服务器，备选）：改用 ws://你的服务器IP:8787/room
// 详见 worker/README.md
// ============================================================
window.MULTI_CONFIG = {
  // ★ 部署 Cloudflare Worker 后替换为你的 workers.dev 地址
  wsUrl: 'wss://byzm-multi.your-subdomain.workers.dev/room'

  // 方案四 Node 服务器（本地测试用）：
  // wsUrl: 'ws://localhost:8787/room'
}
