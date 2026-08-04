# WDream 个人主页 🚀

基于 **uni-app (Vue3 + Vite + JS)** 构建的跨端个人主页，支持 **H5 / 微信小程序 / Android / iOS / 鸿蒙**。

## ✨ 技术栈

| 类别 | 技术 | 版本 |
| ---- | ---- | ---- |
| 框架 | uni-app (DCloud) | 3.0.0 |
| UI | Vue 3 (Composition API) | ^3.4.21 |
| 构建 | Vite | 5.2.8 |
| 样式 | Sass / SCSS | 1.63.2 |
| 状态 | Pinia | 2.1.7 |
| 路由 | uni-app 内置路由 (pages.json) | — |
| HTTP | uni.request + 自定义拦截器 | — |
| UI 组件库 | uView Pro (uview-plus) | ^0.6.5 |
| 图表 | uCharts (QIUN) | ^2.5.0 |
| 图标 | VU-Icons | ^1.3.6 |
| 国际化 | Vue I18n | ^9.1.9 |
| 3D | Three.js | ^0.160.0 |

## 🚀 快速开始

```bash
# 安装依赖
npm install

# H5 开发
npm run dev:h5

# 微信小程序开发（需导入微信开发者工具）
npm run dev:mp-weixin

# App 开发
npm run dev:app

# 构建
npm run build:h5       # H5
npm run build:mp-weixin
npm run build:app
```

## 📁 目录结构

```
├── src/
│   ├── components/       # 自定义组件（easycom 自动注册）
│   │   ├── WdNav/        # 顶部导航
│   │   ├── WdHero/       # Hero 区
│   │   ├── WdAbout/      # 关于我
│   │   ├── WdSkills/     # 技能栈
│   │   ├── WdChart/      # 能力雷达图 (uCharts)
│   │   ├── WdProjects/   # 项目作品
│   │   ├── WdContact/    # 联系方式
│   │   └── WdFooter/     # 页脚
│   ├── i18n/             # 国际化 (中/英)
│   ├── store/            # Pinia 状态管理
│   ├── pages/
│   │   └── index/        # 首页
│   ├── App.vue
│   ├── main.js
│   ├── manifest.json
│   ├── pages.json
│   └── uni.scss
├── legacy/               # 旧版俄罗斯方块游戏存档
├── .github/workflows/    # GitHub Actions 自动部署
└── index.html
```

## 🌐 部署

本项目通过 **GitHub Actions** 自动构建 H5 并部署到 GitHub Pages。

1. 推送代码到 `main` 分支后自动触发部署
2. 若未生效，请到仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**

## 🔧 个性化

- 修改个人信息：编辑 `src/i18n/index.js` 中的文案
- 修改技能与项目：编辑 `src/components/WdSkills/`、`WdProjects/`
- 修改主题色：编辑 `src/uni.scss`