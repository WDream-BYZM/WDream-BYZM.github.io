// ============================================================
// BYZM 联机对战 —— 房间 Durable Object（方案二）
// 每个房间号对应一个 DO 实例，负责 WebSocket 连接管理与消息转发
// 服务器只做"中转"，游戏逻辑全部在客户端本地执行（权威在客户端）
// ============================================================

export class Room {
  constructor(state, env) {
    this.state = state
    this.players = new Map() // id -> { id, name, ws }
    this.maxPlayers = 4
    this.hostId = null
  }

  // 生成 6 位随机玩家 ID
  genId() {
    let id
    do {
      id = Math.random().toString(36).slice(2, 8)
    } while (this.players.has(id))
    return id
  }

  async fetch(request) {
    const pair = new WebSocketPair()
    const client = pair[0]
    const server = pair[1]
    this.state.acceptWebSocket(server)

    const id = this.genId()
    const player = { id, name: '玩家', ws: server }
    this.players.set(id, player)
    if (!this.hostId) this.hostId = id

    server.accept()
    // 给新连接发送欢迎信息
    server.send(
      JSON.stringify({ type: 'welcome', id, hostId: this.hostId, maxPlayers: this.maxPlayers })
    )
    // 广播当前玩家列表（含新加入者）
    this.broadcastAll({ type: 'players', players: this.info(), hostId: this.hostId, maxPlayers: this.maxPlayers })

    return new Response(null, { status: 101, webSocket: client })
  }

  info() {
    return [...this.players.values()].map((p) => ({ id: p.id, name: p.name }))
  }

  findByWs(ws) {
    for (const p of this.players.values()) {
      if (p.ws === ws) return p
    }
    return null
  }

  // 广播给所有连接（含自己）
  broadcastAll(obj) {
    const str = JSON.stringify(obj)
    for (const p of this.players.values()) {
      try { p.ws.send(str) } catch (e) { /* ignore */ }
    }
  }

  // 广播给除 exclude 之外的所有连接
  broadcast(obj, exclude) {
    const str = JSON.stringify(obj)
    for (const p of this.players.values()) {
      if (p.ws === exclude) continue
      try { p.ws.send(str) } catch (e) { /* ignore */ }
    }
  }

  async webSocketMessage(ws, message) {
    let msg
    try { msg = JSON.parse(message) } catch (e) { return }
    const player = this.findByWs(ws)
    if (!player) return

    switch (msg.type) {
      case 'join':
        // 设置昵称
        player.name = String(msg.name || '玩家').slice(0, 12)
        this.broadcastAll({ type: 'players', players: this.info(), hostId: this.hostId, maxPlayers: this.maxPlayers })
        break

      case 'relay':
        // 定向转发：{ type:'relay', to, data } → 发给 to 玩家
        if (msg.to) {
          const target = this.players.get(msg.to)
          if (target) {
            target.ws.send(JSON.stringify({ type: 'peer', from: player.id, fromName: player.name, data: msg.data }))
          }
        }
        break

      case 'broadcast':
        // 广播给其他人：{ type:'broadcast', data }
        this.broadcast({ type: 'peer', from: player.id, fromName: player.name, data: msg.data }, ws)
        break

      case 'room':
        // 发给房间所有人（含自己），用于同步房间状态
        this.broadcastAll({ type: 'peer', from: player.id, fromName: player.name, data: msg.data })
        break
    }
  }

  async webSocketClose(ws, code, reason) {
    const player = this.findByWs(ws)
    if (!player) return
    this.players.delete(player.id)
    if (this.hostId === player.id) {
      const next = this.players.keys().next().value
      this.hostId = next || null
    }
    // 通知房间内其他玩家该玩家离开
    this.broadcastAll({ type: 'playerLeft', id: player.id, hostId: this.hostId, players: this.info(), maxPlayers: this.maxPlayers })
  }
}
