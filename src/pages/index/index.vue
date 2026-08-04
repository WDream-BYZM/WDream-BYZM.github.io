<template>
  <view class="page">
    <WdNav />
    <WdDotNav />
    <WdHero />
    <WdAbout />
    <WdAI />
    <WdContact />
    <WdFooter />
  </view>
</template>

<script setup>
// easycom 自动注册 components/Wd* 目录下的组件
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #0b0f1c;
  overflow-x: hidden;
}
</style>
