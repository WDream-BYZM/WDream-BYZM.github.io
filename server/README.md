# BYZM 联机后端 —— 国内服务器部署指南（方案四）

> **为什么需要这台服务器**：Cloudflare 的 `*.workers.dev` 域名在国内被墙，不开 VPN 无法访问。
> 要让国内用户（不开 VPN）也能联机，最可靠的方式是**把联机服务器部署到国内可直连的服务器**。
> 你的网站 `byzmovo.cn`（GitHub Pages）能直连，但**服务器不在这**，所以联机后端需要另找一台国内服务器。

## 一、准备一台国内服务器（约 30-60 元/月）

推荐**腾讯云/阿里云轻量应用服务器**，最低配即可（2核2G、Ubuntu 22.04、带宽 3-5Mbps 足够几十人联机）。
购买后在控制台**安全组放行 80 和 443 端口**（WebSocket 走 443）。

## 二、部署步骤（Ubuntu）

```bash
# 1. 安装 Node.js 18+ 与 Caddy
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs caddy

# 2. 上传 server 目录到服务器
# （用 scp / FTP / git clone 均可），假设放在 /opt/byzm-multi
cd /opt/byzm-multi
npm install

# 3. 安装 systemd 服务（开机自启 + 崩溃自动重启）
sudo cp byzm-multi.service /etc/systemd/system/
sudo systemctl enable --now byzm-multi
sudo systemctl status byzm-multi     # 应显示 active (running)

# 4. 配置域名解析：在 DNS 服务商给 multi.byzmovo.cn 加一条 A 记录 → 服务器公网 IP

# 5. 配置 Caddy 自动 HTTPS（把 wss://multi.byzmovo.cn 转发到本机 8787）
sudo cp Caddyfile /etc/caddy/Caddyfile
sudo systemctl restart caddy
```

## 三、改前端连接地址

打开 `legacy/multi/config.js`，把 `wsUrl` 改成：

```js
window.MULTI_CONFIG = {
  wsUrl: 'wss://multi.byzmovo.cn/room',
  httpUrl: 'https://multi.byzmovo.cn'
}
```

> ⚠️ 必须用 `wss://`（HTTPS 加密）而不是 `ws://`：你的网站是 HTTPS，浏览器会阻止 HTTPS 页面连接明文 `ws://`（混合内容）。
> Caddy 已自动处理 TLS 证书，所以 `wss://` 开箱即用。

## 四、验证

```bash
# 服务器上测本机
curl http://localhost:8787/health    # {"ok":true,...}

# 本机测公网（不开 VPN）
curl https://multi.byzmovo.cn/health # {"ok":true,...}
```
返回 `{"ok":true,"service":"byzm-multi"}` 即部署成功，之后别人不开 VPN 也能联机。

## 常见问题

- **端口不通**：检查云厂商安全组是否放行 80/443。
- **`wss` 连不上**：确认 `multi.byzmovo.cn` 的 A 记录指向本服务器，且 Caddy 配置正确（`caddy validate`）。
- **人多卡**：Node 单进程足够百人内联机，如果不够可后续加 PM2 多进程/扩容带宽。
