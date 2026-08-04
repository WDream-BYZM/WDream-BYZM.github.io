// ============================================================
// 联机对战 —— 服务器地址配置
// 方案二（Cloudflare Worker）：部署后把下面 wsUrl 换成你的地址
// 方案四（Node 服务器，备选）：改用 ws://你的服务器IP:8787/room
// 详见 worker/README.md
// ============================================================
window.MULTI_CONFIG = {
  // ✅ 已部署的 Cloudflare Worker 地址（2026-08-04）
  wsUrl: 'wss://byzm-multi.byzm.workers.dev/room',
  // HTTP 接口（查询在线房间列表用）
  httpUrl: 'https://byzm-multi.byzm.workers.dev'

  // 方案四 Node 服务器（本地测试用）：
  // wsUrl: 'ws://localhost:8787/room'
}
