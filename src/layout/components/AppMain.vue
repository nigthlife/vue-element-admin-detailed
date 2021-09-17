<template>
<!-- 设置标题 -->
  <section class="app-main">
    <!--
      可以给任何元素和组件添加进入/离开过渡
      1.自动嗅探目标元素是否应用了 CSS 过渡或动画，如果是，在恰当的时机添加/删除 CSS 类名。
      提供6个class过渡切换
     -->
     <!--transition：单元素/组件的过渡 -->
    <transition name="fade-transform" mode="out-in">
      <!-- 使用keep-alive保留状态，避免重新渲染 -->
      <keep-alive :include="cachedViews">
        <!-- 将进入过的视图组件都缓存起来 -->
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // 缓存视图
    cachedViews() {
      // 获取标签视图中的缓存视图
      return this.$store.state.tagsView.cachedViews
    },
    // 获取当前路由路径
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// 修复打开 el-dialog 中的 css 样式错误
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
