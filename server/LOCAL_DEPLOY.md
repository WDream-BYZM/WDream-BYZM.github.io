# 闲置电脑当联机服务器（Tailscale Funnel 免费方案）

> 用一台闲置电脑（Windows 或 Linux）跑联机服务器，零成本，让国内用户不开 VPN 也能联机。
> 原理：本地 Node 服务器 + Tailscale Funnel 免费把服务暴露为 `wss://xxx.ts.net`（自动 HTTPS 证书）。

## 你需要

- 一台**闲置电脑**（能长期开机，Windows 10/11 或 Linux 均可）
- 一个 **Tailscale 账号**（免费注册：https://login.tailscale.com 用邮箱/Google 登录即可）

## 部署步骤

### 第 1 步：把 server 目录拷到闲置电脑

把 `server/` 整个文件夹拷到闲置电脑任意位置（例如 `D:\byzm-server` 或 `/opt/byzm-server`）。

### 第 2 步：安装 Node.js

- **Windows**：到 https://nodejs.org 下载 LTS 版安装（一路下一步）
- **Linux (Ubuntu/Debian)**：`sudo apt install -y nodejs npm`

### 第 3 步：启动服务器

- **Windows**：双击 `start-server.bat`
- **Linux**：`chmod +x start-server.sh && ./start-server.sh`

看到 `BYZM Multi] 联机服务器已启动：ws://localhost:8787/room` 即成功。**保持窗口/进程运行。**

### 第 4 步：安装 Tailscale 并开启 Funnel

1. 装 Tailscale：
   - Windows：https://tailscale.com/download/windows
   - Linux：`curl -fsSL https://tailscale.com/install.sh | sh`
2. 登录：`tailscale up`（会打印链接，浏览器打开登录账号）
3. 开启 Funnel 暴露 8787 端口：
   ```bash
   tailscale funnel 8787
   ```
   成功后它会显示一个公网地址，形如：
   ```
   https://<机器名>.<你的tailnet>.ts.net
   ```
   **记下这个地址**，它支持 HTTPS（wss）。

> 免费版 Tailscale Funnel 可用。若提示需要 HTTPS 证书，等待几秒自动签发。

### 第 5 步：改前端连接地址

在项目里打开 `legacy/multi/config.js`，把 wsUrl 改成你的 Funnel 地址：

```js
window.MULTI_CONFIG = {
  wsUrl: 'wss://<机器名>.<你的tailnet>.ts.net/room',
  httpUrl: 'https://<机器名>.<你的tailnet>.ts.net'
}
```

然后构建部署网站（GitHub Actions 会自动部署），别人打开 byzmovo.cn 就能联机了。

### 第 6 步：验证

```bash
# 本机（闲置电脑）
curl http://localhost:8787/health     # {"ok":true,...}

# 外部（别人/你手机，不开 VPN）
curl https://<机器名>.<你的tailnet>.ts.net/health
```
返回 `{"ok":true,"service":"byzm-multi"}` 即成功。

## 注意事项

- **电脑不能关机**：关机 = 联机中断。建议设置通电自动开机 + 开机自启服务器。
- **带宽**：家宽上行一般够几十人联机（每个连接数据量很小）。
- **稳定性**：Tailscale Funnel 免费版足够个人项目使用；若以后人数多或要求极高稳定性，再考虑付费内网穿透或云服务器。
- **国内可达性**：`.ts.net` 在国内大部分地区可访问（走 Tailscale 国内/香港节点）。若你网络下不通，告诉我，我们换备选方案。
