<template>
  <div class="chart-container">
    <!-- 设置宽高 -->
    <chart height="100%" width="100%" />
  </div>
</template>

<script>
import Chart from '@/components/Charts/Keyboard' // 导入图表组件

export default {
  name: 'KeyboardChart',
  components: { Chart }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>

