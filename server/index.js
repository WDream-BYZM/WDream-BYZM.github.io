// ============================================================
// BYZM 联机对战 —— Node WebSocket 服务器（方案四备选）
// 协议与 Cloudflare Worker 完全一致，前端仅需切换 wsUrl
// 启动：npm install && node index.js  （默认端口 8787）
// ============================================================
const http = require('http')
const { WebSocketServer } = require('ws')

const PORT = process.env.PORT || 8787

const rooms = new Map() // roomId -> { players: Map<id,{id,name,ws}>, hostId }

function genId(room) {
  let id
  do {
    id = Math.random().toString(36).slice(2, 8)
  } while (room.players.has(id))
  return id
}

function info(room) {
  return [...room.players.values()].map((p) => ({ id: p.id, name: p.name }))
}

function broadcast(room, obj, exclude) {
  const str = JSON.stringify(obj)
  for (const p of room.players.values()) {
    if (p.ws === exclude) continue
    if (p.ws.readyState === 1) p.ws.send(str)
  }
}

function broadcastAll(room, obj) {
  broadcast(room, obj, null)
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.url === '/' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true, service: 'byzm-multi' }))
    return
  }
  res.writeHead(404)
  res.end('Not Found')
})

const wss = new WebSocketServer({ server })

wss.on('connection', (ws, req) => {
  const m = (req.url || '').match(/^\/room\/([A-Za-z0-9]{1,8})$/)
  const roomId = m ? m[1].toUpperCase() : '0000'

  let room = rooms.get(roomId)
  if (!room) {
    room = { players: new Map(), hostId: null }
    rooms.set(roomId, room)
  }
  // 房间满员
  if (room.players.size >= 4) {
    ws.send(JSON.stringify({ type: 'error', msg: '房间已满' }))
    ws.close()
    return
  }

  const id = genId(room)
  const player = { id, name: '玩家', ws }
  room.players.set(id, player)
  if (!room.hostId) room.hostId = id

  ws.send(JSON.stringify({ type: 'welcome', id, hostId: room.hostId, maxPlayers: 4 }))
  broadcastAll(room, { type: 'players', players: info(room), hostId: room.hostId, maxPlayers: 4 })

  ws.on('message', (raw) => {
    let msg
    try { msg = JSON.parse(raw.toString()) } catch (e) { return }
    switch (msg.type) {
      case 'join':
        player.name = String(msg.name || '玩家').slice(0, 12)
        broadcastAll(room, { type: 'players', players: info(room), hostId: room.hostId, maxPlayers: 4 })
        break
      case 'relay':
        if (msg.to) {
          const target = room.players.get(msg.to)
          if (target && target.ws.readyState === 1) {
            target.ws.send(JSON.stringify({ type: 'peer', from: player.id, fromName: player.name, data: msg.data }))
          }
        }
        break
      case 'broadcast':
        broadcast(room, { type: 'peer', from: player.id, fromName: player.name, data: msg.data }, ws)
        break
      case 'room':
        broadcastAll(room, { type: 'peer', from: player.id, fromName: player.name, data: msg.data })
        break
    }
  })

  ws.on('close', () => {
    room.players.delete(id)
    if (room.hostId === id) {
      const next = room.players.keys().next().value
      room.hostId = next || null
    }
    broadcastAll(room, { type: 'playerLeft', id, hostId: room.hostId, players: info(room), maxPlayers: 4 })
    if (room.players.size === 0) rooms.delete(roomId)
  })
})

server.listen(PORT, () => {
  console.log(`[BYZM Multi] 联机服务器已启动：ws://localhost:${PORT}/room`)
})
