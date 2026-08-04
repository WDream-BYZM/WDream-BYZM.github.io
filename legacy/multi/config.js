// ============================================================
// 联机对战 —— 服务器地址配置
// ★ 重要：*.workers.dev 在国内被墙，不开 VPN 连不上！
//   要让国内用户（不开 VPN）也能联机，请部署到国内服务器
//   并切换到下面的"国内服务器"配置（详见 server/README.md）
// ============================================================
window.MULTI_CONFIG = {
  // ---------- 当前启用：闲置电脑 + Tailscale Funnel（国内直连，无需 VPN）----------
  wsUrl: 'wss://byzm-desktop.tail2a2672.ts.net/room',
  httpUrl: 'https://byzm-desktop.tail2a2672.ts.net'

  // ---------- 配置 2：Cloudflare Worker（需 VPN）----------
  // wsUrl: 'wss://byzm-multi.byzm.workers.dev/room',
  // httpUrl: 'https://byzm-multi.byzm.workers.dev'

  // ---------- 国内服务器 / 本地 Node 测试 ----------
  // wsUrl: 'ws://localhost:8787/room'
}
