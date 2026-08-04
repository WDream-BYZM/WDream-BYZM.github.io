// ============================================================
// BYZM 联机对战 —— Cloudflare Worker 入口（方案二）
// 部署方式见 worker/README.md
// ============================================================
import { Room } from './room.js'

export { Room }

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    // 健康检查
    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response(JSON.stringify({ ok: true, service: 'byzm-multi' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      })
    }

    // CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      })
    }

    // 房间 WebSocket：/room/<roomId>（4 位房间号）
    const m = url.pathname.match(/^\/room\/([A-Za-z0-9]{1,8})$/)
    if (m) {
      const roomId = m[1].toUpperCase()
      const upgrade = (request.headers.get('Upgrade') || '').toLowerCase()
      if (!upgrade.includes('websocket')) {
        return new Response('Expected WebSocket', { status: 400 })
      }
      const id = env.ROOMS.idFromName(roomId)
      const stub = env.ROOMS.get(id)
      return stub.fetch(request)
    }

    return new Response('Not Found', { status: 404 })
  }
}
