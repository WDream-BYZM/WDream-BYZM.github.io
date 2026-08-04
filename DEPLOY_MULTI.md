# 联机后端部署方案总览

> 目标：让**国内用户不开 VPN** 也能联机对战。
> 现状：`*.workers.dev` 在国内被墙，Cloudflare Worker 方案必须开 VPN 才能连。

## 两个可选方案

### 方案 A：国内服务器 + Node 后端（推荐，最可靠）

- **原理**：把联机服务器部署到国内可直连的服务器，走你的域名 `multi.byzmovo.cn`（未被墙）
- **成本**：约 30-60 元/月（腾讯云/阿里云轻量服务器最低配即可）
- **前置**：需要一台国内服务器 + 一个子域名解析
- **步骤**：见 `server/README.md`（已含一键 systemd + Caddy 自动 HTTPS）
- **改前端**：`legacy/multi/config.js` 切到配置 2

### 方案 B：绑定 Cloudflare 自定义域（不推荐，有被墙风险）

- **原理**：把 `byzmovo.cn` DNS 迁移到 Cloudflare，给 Worker 绑定 `multi.byzmovo.cn`
- **风险**：Cloudflare 边缘 IP 在国内可能被墙/劣化，可能连主站 `byzmovo.cn` 也访问不了
- **步骤**：
  1. 到你的 DNS 服务商，把 `byzmovo.cn` 的 NS 记录改为 Cloudflare 提供的两个 NS
  2. 在 Cloudflare DNS 里重建记录：`byzmovo.cn` / `www` → CNAME 到 `你的用户名.github.io`（保持 GitHub Pages）
  3. Cloudflare Dashboard → Workers → 你的 Worker → Settings → Domains & Routes → 添加 `multi.byzmovo.cn`
  4. 改 `legacy/multi/config.js` 的 `wsUrl` 为 `wss://multi.byzmovo.cn/room`

## 相关文件

| 文件 | 说明 |
|------|------|
| `server/index.js` | Node 联机服务器（协议与 Cloudflare Worker 完全一致） |
| `server/byzm-multi.service` | systemd 服务（开机自启 + 崩溃重启） |
| `server/Caddyfile` | Caddy 自动 HTTPS 反向代理 → wss |
| `server/README.md` | 国内服务器完整部署指南 |
| `worker/` | Cloudflare Worker 方案（需 VPN） |
| `legacy/multi/config.js` | 前端连接地址（一键切换方案） |
