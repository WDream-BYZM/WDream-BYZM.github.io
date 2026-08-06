<script>
export default {
  onLaunch() {
    console.log('App Launch')
  },
  onShow() {},
  onHide() {}
}
</script>

<style lang="scss">
/* 引入 uView Pro 全局样式 */
@import 'uview-plus/index.scss';

/* 全局基础样式 */
page {
  background-color: #0b0f1c;
  color: #e8ecf7;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* 首页板块滚动进入过渡（reveal-in 由 index.vue 的轮询逻辑添加） */
.reveal-pre {
  opacity: 0;
  transform: translateY(40px);
}

.reveal-in {
  opacity: 1;
  transform: none;
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (prefers-reduced-motion: reduce) {
  .reveal-pre {
    opacity: 1;
    transform: none;
  }
}
</style>
