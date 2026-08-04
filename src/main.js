import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import uviewPlus from 'uview-plus'
import App from './App.vue'
import i18n from './i18n/index.js'

export function createApp() {
  const app = createSSRApp(App)

  // 状态管理 Pinia
  app.use(Pinia.createPinia())

  // 国际化 Vue I18n
  app.use(i18n)

  // uView Pro UI 组件库
  app.use(uviewPlus)

  return {
    app,
    Pinia
  }
}
