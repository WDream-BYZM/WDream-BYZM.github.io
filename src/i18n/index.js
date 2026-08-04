import { createI18n } from 'vue-i18n'

const messages = {
  'zh-CN': {
    nav: {
      home: '首页',
      about: '关于我',
      ai: 'AI',
      contact: '联系'
    },
    hero: {
      hello: '你好，我是',
      name: 'BYZM',
      typewriter: ['前端开发者', '全栈爱好者', '独立创作者'],
      slogan: '用代码构建梦想，以创意点亮世界',
      viewWork: '查看项目',
      contactMe: '联系我'
    },
    about: {
      title: '关于我',
      subtitle: 'ABOUT ME',
      desc: '我是一名热爱技术的前端开发者，专注于构建优雅、高效的 Web 与跨端应用。热衷于探索新技术，追求卓越的用户体验与代码质量。',
      empty: '内容更新中...',
      years: '年经验',
      projects: '个项目',
      cups: '杯咖啡',
      stars: '颗星'
    },
    ai: {
      title: 'AI 对话',
      subtitle: 'AI CHAT',
      placeholder: '输入你的问题...',
      greeting: '你好！我是 BYZM 的 AI 助手，有什么可以帮你？',
      error: '出错了：',
      image: '[图片]',
      visionPrefix: '（图片识别结果：',
      visionUnconfigured: '图片识别服务尚未配置，请提供视觉 AI 的接入信息。'
    },
    contact: {
      title: '联系我',
      subtitle: 'CONTACT ME',
      desc: '无论是有趣的想法、合作机会，还是技术交流，都欢迎联系我！',
      email: '邮箱',
      github: 'GitHub',
      copy: '复制成功！',
      send: '发送邮件'
    },
    footer: {
      copyright: '© 2026 BYZM',
      powered: 'Powered by uni-app'
    },
    stats: {
      experience: '2+',
      projects: '6',
      coffee: '999',
      stars: '128'
    }
  },
  'en-US': {
    nav: {
      home: 'Home',
      about: 'About',
      ai: 'AI',
      contact: 'Contact'
    },
    hero: {
      hello: "Hi, I'm",
      name: 'BYZM',
      typewriter: ['Frontend Developer', 'Fullstack Enthusiast', 'Independent Creator'],
      slogan: 'Building dreams with code, lighting the world with creativity',
      viewWork: 'View Projects',
      contactMe: 'Contact Me'
    },
    about: {
      title: 'About Me',
      subtitle: 'ABOUT ME',
      desc: 'I am a frontend developer passionate about technology, focusing on building elegant and efficient web and cross-platform applications. I love exploring new technologies and pursuing excellent user experience and code quality.',
      empty: 'Content coming soon...',
      years: 'Years Exp',
      projects: 'Projects',
      cups: 'Cups of Coffee',
      stars: 'Stars'
    },
    ai: {
      title: 'AI Chat',
      subtitle: 'AI CHAT',
      placeholder: 'Type your question...',
      greeting: "Hi! I am BYZM's AI assistant. How can I help you?",
      error: 'Error: ',
      image: '[Image]',
      visionPrefix: '(Image recognition result: ',
      visionUnconfigured:
        'Image recognition service is not configured yet. Please provide the vision AI access info.'
    },
    contact: {
      title: 'Contact Me',
      subtitle: 'CONTACT ME',
      desc: 'Feel free to reach out for ideas, collaborations, or tech discussions!',
      email: 'Email',
      github: 'GitHub',
      copy: 'Copied!',
      send: 'Send Email'
    },
    footer: {
      copyright: '© 2026 BYZM',
      powered: 'Powered by uni-app'
    },
    stats: {
      experience: '2+',
      projects: '6',
      coffee: '999',
      stars: '128'
    }
  }
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages
})

export default i18n
