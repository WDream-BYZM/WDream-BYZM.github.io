# 🕹️ NES 红白机模拟器

在你的个人主页浏览器里运行红白机（FC / NES）游戏，基于 **EmulatorJS**（WebAssembly 模拟器）。

## 怎么用

1. 打开 `/legacy/nes/index.html`
2. 点「📂 选择 .nes 游戏文件」从电脑本地载入一个 ROM（无需上传服务器），
   或者点 ROM 列表里的「Demo 测试 ROM」快速试玩。

## 放自己的游戏（永久收录）

1. 把你的 `.nes` 文件复制到本目录的 `roms/` 文件夹，例如 `roms/超级玛丽.nes`
2. 打开 `index.html`，在文件开头的 `ROM_LIST` 数组里加一行：

```js
var ROM_LIST = [
  { name: '🎮 Demo 测试 ROM', url: 'roms/demo.nes' },
  { name: '🏷️ 超级玛丽', url: 'roms/超级玛丽.nes' }   // ← 新增
];
```

3. 保存后重新部署，页面上就会出现这个游戏的按钮，点击即玩。

## 操作

- **键盘**：方向键 = 十字键，`Z` = B，`X` = A，`Enter` = Start，`Shift` = Select（可改键）
- **手柄**：连接手柄可直接玩（支持 2 个手柄）
- **手机**：自动显示触摸虚拟按键
- 页面自带菜单：存档 / 读档 / 快进 / 全屏

## ROM 版权提醒

NES 游戏 ROM 有版权，**只能放你自己合法拥有的游戏**（正版卡带自 dump、自制程序、
免费 Homebrew 游戏）。不要往公开仓库传商业 ROM，会有 DMCA 风险。
`roms/demo.nes` 是一个**自写的最小测试 ROM**（仅验证模拟器用），无版权。

## 技术说明

- 模拟器核心走多 CDN 加载（`cdn.emulatorjs.org` 官方 CDN，备用 `jsdelivr` 镜像），
  页面打开时会按顺序尝试，网络正常即可加载
- 核心：NES 默认用 `fceumm`（兼容性好），游戏名/存档都基于 ROM 文件名
- 存档存浏览器本地（IndexedDB），换设备/清缓存会丢失

## 同步部署

本项目用 uni-app 构建，`legacy/` 下的子游戏需在构建后同步到产物目录：

```powershell
robocopy legacy dist\build\h5\legacy /E
```
