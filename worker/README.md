# BYZM 联机对战 —— Cloudflare Worker 部署说明（方案二）

本项目联机后端采用 **Cloudflare Workers + Durable Objects** 实现：
- 每个 4 位房间号对应一个 Durable Object 实例
- 服务器只做 WebSocket 中继（玩家列表维护 + 消息转发），游戏逻辑在客户端本地执行
- 免费额度充足，全球节点，无需自己维护服务器

## 部署步骤

1. 安装 wrangler（需已注册 Cloudflare 账号）
   ```bash
   npm i -g wrangler
   cd worker
   wrangler login
   ```

2. 部署
   ```bash
   wrangler deploy
   ```

3. 部署完成后会输出一个域名，例如：
   ```
   https://byzm-multi.<你的子域>.workers.dev
   ```

4. 把该地址填入前端联机配置 `legacy/multi/config.js`：
   ```js
   window.MULTI_CONFIG = {
     wsUrl: 'wss://byzm-multi.<你的子域>.workers.dev/room'
   }
   ```

## 本地调试
```bash
cd worker
wrangler dev
```
本地会运行在 `http://localhost:8787`，联机地址为 `ws://localhost:8787/room`。

## 备选方案（方案四：自建 Node 服务器）
如果不想用 Cloudflare，项目 `server/` 目录提供了同协议的 Node WebSocket 服务器：

```bash
cd server
npm install
node index.js          # 监听 8787 端口
```
然后同样把 `legacy/multi/config.js` 的 `wsUrl` 改为 `ws://你的服务器IP:8787/room`（部署时记得用 `wss://` 并配置 HTTPS 证书）。

两种后端协议完全一致，前端无需任何改动，只需切换 `wsUrl`。
