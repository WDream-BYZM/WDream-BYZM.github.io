import { defineStore } from 'pinia'

// 全局应用状态
export const useAppStore = defineStore('app', {
  state: () => ({
    // 主题模式：dark / light
    theme: 'dark',
    // 页面是否已加载
    loaded: false
  }),
  getters: {
    isDark: (state) => state.theme === 'dark'
  },
  actions: {
    toggleTheme() {
      this.theme = this.isDark ? 'light' : 'dark'
    },
    setLoaded(val) {
      this.loaded = val
    }
  }
})
