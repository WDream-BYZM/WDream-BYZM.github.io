import { createI18n } from 'vue-i18n'

const messages = {
  'zh-CN': {
    nav: {
      home: '首页',
      about: '关于我',
      skills: '技能',
      projects: '作品',
      contact: '联系'
    },
    hero: {
      hello: '你好，我是',
      name: 'WDream',
      typewriter: ['前端开发者', '全栈爱好者', '独立创作者'],
      slogan: '用代码构建梦想，以创意点亮世界',
      viewWork: '查看作品',
      contactMe: '联系我'
    },
    about: {
      title: '关于我',
      subtitle: 'ABOUT ME',
      desc: '我是一名热爱技术的前端开发者，专注于构建优雅、高效的 Web 与跨端应用。热衷于探索新技术，追求卓越的用户体验与代码质量。',
      years: '年经验',
      projects: '个项目',
      cups: '杯咖啡',
      stars: '颗星'
    },
    skills: {
      title: '技能栈',
      subtitle: 'MY SKILLS',
      desc: '持续学习，不断精进'
    },
    chart: {
      title: '能力雷达',
      subtitle: 'SKILL RADAR'
    },
    projects: {
      title: '项目作品',
      subtitle: 'MY PROJECTS',
      view: '查看详情',
      items: {
        tetris: {
          name: '俄罗斯方块',
          desc: '经典俄罗斯方块小游戏，Canvas 绘制，支持键盘与触屏操作。',
          tag: '游戏'
        },
        homepage: {
          name: '个人主页',
          desc: '基于 uni-app 的跨端个人主页，支持 H5 / 小程序 / App。',
          tag: '前端'
        },
        ai: {
          name: 'AI 助手',
          desc: '集成 DeepSeek 大模型的智能对话助手（开发中）。',
          tag: 'AI'
        }
      }
    },
    contact: {
      title: '联系我们',
      subtitle: 'GET IN TOUCH',
      desc: '无论是有趣的想法、合作机会，还是技术交流，都欢迎联系我！',
      email: '邮箱',
      github: 'GitHub',
      copy: '复制成功！',
      send: '发送邮件'
    },
    footer: {
      copyright: '© 2026 WDream · 用 构建',
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
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact'
    },
    hero: {
      hello: "Hi, I'm",
      name: 'WDream',
      typewriter: ['Frontend Developer', 'Fullstack Enthusiast', 'Independent Creator'],
      slogan: 'Building dreams with code, lighting the world with creativity',
      viewWork: 'View Work',
      contactMe: 'Contact Me'
    },
    about: {
      title: 'About Me',
      subtitle: 'ABOUT ME',
      desc: 'I am a frontend developer passionate about technology, focusing on building elegant and efficient web and cross-platform applications. I love exploring new technologies and pursuing excellent user experience and code quality.',
      years: 'Years Exp',
      projects: 'Projects',
      cups: 'Cups of Coffee',
      stars: 'Stars'
    },
    skills: {
      title: 'Skills',
      subtitle: 'MY SKILLS',
      desc: 'Keep learning, keep improving'
    },
    chart: {
      title: 'Skill Radar',
      subtitle: 'SKILL RADAR'
    },
    projects: {
      title: 'Projects',
      subtitle: 'MY PROJECTS',
      view: 'View Detail',
      items: {
        tetris: {
          name: 'Tetris',
          desc: 'Classic Tetris game built with Canvas, supporting keyboard and touch.',
          tag: 'Game'
        },
        homepage: {
          name: 'Personal Homepage',
          desc: 'Cross-platform personal homepage built with uni-app (H5 / Mini Program / App).',
          tag: 'Frontend'
        },
        ai: {
          name: 'AI Assistant',
          desc: 'Smart chat assistant integrating DeepSeek LLM (in development).',
          tag: 'AI'
        }
      }
    },
    contact: {
      title: 'Get In Touch',
      subtitle: 'GET IN TOUCH',
      desc: 'Feel free to reach out for ideas, collaborations, or tech discussions!',
      email: 'Email',
      github: 'GitHub',
      copy: 'Copied!',
      send: 'Send Email'
    },
    footer: {
      copyright: '© 2026 WDream · Built with ',
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
