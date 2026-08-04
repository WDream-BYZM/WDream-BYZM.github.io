// ============================================================
// BYZM 联机对战 —— 房间登记中心 Durable Object
// 单例（idFromName('global')），记录所有活跃房间，供游戏页查询
// ============================================================

export class Registry {
  constructor(state, env) {
    this.state = state
  }

  async fetch(request) {
    const url = new URL(request.url)
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    // GET /rooms → 列出活跃房间
    if (url.pathname === '/rooms' || url.pathname === '/') {
      if (request.method === 'GET') {
        const list = await this.state.storage.list({ prefix: 'room:' })
        const rooms = []
        for (const [, v] of list) rooms.push(v)
        rooms.sort((a, b) => (b.updated || 0) - (a.updated || 0))
        return new Response(JSON.stringify({ rooms }), {
          status: 200,
          headers: { ...cors, 'Content-Type': 'application/json' }
        })
      }
      // POST /rooms → 更新房间记录
      if (request.method === 'POST') {
        let body = {}
        try { body = await request.json() } catch (e) { /* ignore */ }
        const roomId = String(body.roomId || '').toUpperCase()
        if (!roomId) {
          return new Response(JSON.stringify({ ok: false, msg: 'missing roomId' }), {
            status: 400, headers: { ...cors, 'Content-Type': 'application/json' }
          })
        }
        await this.state.storage.put('room:' + roomId, {
          roomId,
          game: body.game || 'tetris',
          players: Array.isArray(body.players) ? body.players : [],
          maxPlayers: body.maxPlayers || 4,
          created: Date.now(),
          updated: Date.now()
        })
        return new Response(JSON.stringify({ ok: true }), {
          status: 200, headers: { ...cors, 'Content-Type': 'application/json' }
        })
      }
    }

    // DELETE /rooms/:roomId → 移除房间记录
    const del = url.pathname.match(/^\/rooms\/([A-Za-z0-9]+)$/)
    if (del && request.method === 'DELETE') {
      await this.state.storage.delete('room:' + del[1].toUpperCase())
      return new Response(JSON.stringify({ ok: true }), {
        status: 200, headers: { ...cors, 'Content-Type': 'application/json' }
      })
    }

    return new Response('Not Found', { status: 404, headers: cors })
  }
}
