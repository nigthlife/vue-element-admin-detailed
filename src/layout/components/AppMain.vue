<template>
  <!-- 设置标题 -->
  <section class="app-main">
    <!--
      可以给任何元素和组件添加进入/离开过渡
      1.自动嗅探目标元素是否应用了 CSS 过渡或动画，如果是，在恰当的时机添加/删除 CSS 类名。
      提供6个class过渡切换
     -->
    <!--transition：单元素/组件的过渡 -->
    <!-- 定义了页面之间切换动画，可以根据自己的需求，自行修改转场动画 -->
    <!-- 默认提供了fade和fade-transform两个转场动画 -->
    <!-- 具体 css 实现见transition.scss -->
    <transition name="fade-transform" mode="out-in">
      <!-- 使用keep-alive保留状态，避免重新渲染 -->
      <!-- 主要是为了缓存 <router-view> 的，配合页面的 tabs-view 标签导航使用，如不需要可去除 -->
      <keep-alive :include="cachedViews">
        <!-- 将进入过的视图组件都缓存起来 -->
        <!-- 如果某俩个页面用的是用一个组件，默认情况这俩个组件不会触发vue的created和mounted钩子 -->
        <!-- 所以可以在router-view 上加上一个唯一的 key，来保证路由切换时都会重新渲染触发钩子 -->
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
      // 只要保证 key 唯一性就可以了，保证不同页面的 key 不相同
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
