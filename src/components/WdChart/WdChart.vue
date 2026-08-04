<template>
  <view class="wd-section chart-section" id="chart">
    <view class="section-inner">
      <view class="section-head">
        <text class="section-sub">{{ t('chart.subtitle') }}</text>
        <text class="section-title">{{ t('chart.title') }}</text>
        <view class="section-line"></view>
      </view>

      <view class="chart-wrap">
        <canvas
          class="chart-canvas"
          :canvas-id="canvasId"
          :id="canvasId"
          @touchstart="touchChart"
        ></canvas>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import uCharts from '@qiun/ucharts'

const { t } = useI18n()
const instance = getCurrentInstance()

const canvasId = 'skillRadar'
const chart = ref(null)

const categories = ['HTML/CSS', 'JavaScript', 'Vue3', 'uni-app', '工程化', 'Node.js']
const data = [95, 90, 85, 82, 75, 70]

function renderChart() {
  // #ifdef MP-WEIXIN
  const ctx = uni.createCanvasContext(canvasId, instance.proxy)
  // #endif
  // #ifdef H5
  const ctx = uni.createCanvasContext(canvasId, instance.proxy)
  // #endif

  chart.value = new uCharts({
    $this: instance.proxy,
    canvasId,
    type: 'radar',
    context: ctx,
    width: 360,
    height: 320,
    categories,
    series: [
      {
        name: 'WDream',
        data,
        color: '#6c5ce7'
      }
    ],
    animation: true,
    background: 'rgba(0,0,0,0)',
    dataLabel: true,
    dataPointShape: true,
    extra: {
      radar: {
        gridColor: 'rgba(255,255,255,0.12)',
        gridCount: 4,
        max: 100,
        labelColor: '#8a93ab'
      }
    }
  })
}

function touchChart(e) {
  if (chart.value) chart.value.touchLegend(e)
  if (chart.value) chart.value.showToolTip(e)
}

onMounted(() => {
  setTimeout(() => {
    renderChart()
  }, 200)
})
</script>

<style lang="scss" scoped>
.wd-section {
  padding: 120rpx 40rpx;
  background: linear-gradient(180deg, rgba(11, 15, 28, 0), rgba(21, 26, 44, 0.6));
}

.section-inner {
  max-width: 1000px;
  margin: 0 auto;

  /* #ifdef H5 */
  max-width: 900px;
  /* #endif */
}

.section-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;

  .section-sub {
    color: #00d2ff;
    font-size: 13px;
    letter-spacing: 4px;
    font-weight: 600;
  }

  .section-title {
    margin-top: 14rpx;
    font-size: 38px;
    font-weight: 800;
    color: #e8ecf7;
  }

  .section-line {
    margin-top: 20rpx;
    width: 60px;
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(90deg, #6c5ce7, #00d2ff);
  }
}

.chart-wrap {
  display: flex;
  justify-content: center;
  padding: 30rpx 0;

  .chart-canvas {
    width: 360px;
    height: 320px;
  }
}
</style>
