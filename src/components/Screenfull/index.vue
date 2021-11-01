<template>
  <!-- 全屏显示组件 -->
  <div>
    <!-- 图标 -->
    <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" />
  </div>
</template>

<script>
// 全屏组件地址：https://github.com/sindresorhus/screenfull.js/
import screenfull from 'screenfull' // 导入全屏显示组件 npm install --save screenfull

export default {
  name: 'Screenfull',
  data() {
    return {
      // 默认不全屏
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
  },
  // 实例销毁之前调用
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    // 点击全屏
    click() {
      // 点击时判断浏览器是否可全屏,不可全屏给提示,可全屏执行screenfull.toggle()
      // screenfull.enabled：返回一个布尔值是否允许您进入全屏
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    change() {
      // screenfull.isFullscreen：返回一个布尔值是否全屏处于活动状态
      this.isFullscreen = screenfull.isFullscreen
    },
    // 添加事件
    init() {
      if (screenfull.enabled) {
        // 添加一个监听器，用于浏览器何时进入和退出全屏或出现错误。
        screenfull.on('change', this.change)
      }
    },
    // 关闭事件
    destroy() {
      if (screenfull.enabled) {
        // 删除以前注册的事件侦听器。
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
