import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  css: {
    preprocessorOptions: {
      scss: {
        // 注入全局 SCSS 变量（按需使用）
        additionalData: ``,
        javascriptEnabled: true
      }
    }
  },
  // H5 构建产物目录（GitHub Actions 部署用）
  build: {
    outDir: 'dist/build/h5',
    chunkSizeWarningLimit: 1500
  }
})
