<template>
  <div :class="classObj" class="app-wrapper">
    <!-- 判断设备是移动端 侧边栏状态是打开  那么隐藏侧边栏-->
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <!-- 侧边栏 -->
    <sidebar class="sidebar-container" />

    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <!-- 导航栏 -->
        <navbar />
        <!-- 窗口记录 -->
        <tags-view v-if="needTagsView" />
      </div>
      <!-- 主面板 -->
      <app-main />
      <!-- 右边设置面板 -->
      <right-panel v-if="showSettings">
        <!-- 设置 -->
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel' // 右方面板
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,    // 主面板
    Navbar,     // 导航栏
    RightPanel, // 右侧设置面板
    Settings,   // 右侧设置面板组件
    Sidebar,    // 侧边栏
    TagsView    // 历史记录窗口
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,                // 侧边栏状态
      device: state => state.app.device,                  // 当前设备
      showSettings: state => state.settings.showSettings, // 显示设置面板
      needTagsView: state => state.settings.tagsView,     // 窗口记录 缓存组件
      fixedHeader: state => state.settings.fixedHeader    // 固定标题
    }),
    classObj() {
      return {
        // 隐藏侧边栏：默认false 可修改opened的三目运算符true为false
        hideSidebar: !this.sidebar.opened,
        // 打开侧边栏：默认为true
        openSidebar: this.sidebar.opened,
        // 设置动画，默认没有false
        withoutAnimation: this.sidebar.withoutAnimation,
        // 判断设备是否为移动端
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    // 外部点击处理
    handleClickOutside() {
      // 隐藏侧边栏
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
