// ============================================================
// BYZM 联机对战 —— Cloudflare Worker 入口（方案二）
// 部署方式见 worker/README.md
// ============================================================
import { Room } from './room.js'
import { Registry } from './registry.js'

export { Room, Registry }

export default {
  async fetch(request, env, ctx) {
    try {
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

      // 诊断：测试 Durable Object 是否可调用
      if (url.pathname === '/do-test') {
        const id = env.ROOMS.idFromName('DIAG')
        const stub = env.ROOMS.get(id)
        return stub.fetch(new Request('https://internal.test/ping', { method: 'GET' }))
      }

      // 房间登记中心：查询/更新活跃房间列表
      if (url.pathname === '/rooms' || url.pathname.startsWith('/rooms/')) {
        const stub = env.REGISTRY.get(env.REGISTRY.idFromName('global'))
        return stub.fetch(request)
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
    } catch (e) {
      return new Response('Worker Error: ' + (e && e.stack ? e.stack : e), { status: 500 })
    }
  }
}
