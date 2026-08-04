// ============================================================
// 联机对战 —— 服务器地址配置
// ★ 重要：*.workers.dev 在国内被墙，不开 VPN 连不上！
//   要让国内用户（不开 VPN）也能联机，请部署到国内服务器
//   并切换到下面的"国内服务器"配置（详见 server/README.md）
// ============================================================
window.MULTI_CONFIG = {
  // ---------- 配置 1：Cloudflare Worker（默认，需 VPN 才能连）----------
  wsUrl: 'wss://byzm-multi.byzm.workers.dev/room',
  httpUrl: 'https://byzm-multi.byzm.workers.dev'

  // ---------- 配置 2：国内服务器（推荐，别人不用 VPN 也能连）----------
  // 部署好后取消下面两行注释，并注释掉配置 1 即可
  // wsUrl: 'wss://multi.byzmovo.cn/room',
  // httpUrl: 'https://multi.byzmovo.cn'

  // ---------- 本地 Node 测试服务器 ----------
  // wsUrl: 'ws://localhost:8787/room'
}
