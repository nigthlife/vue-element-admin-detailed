<template>
<!-- 判断是否显示logo -->
  <div :class="{'has-logo':showLogo}">
    <!-- 判断是否隐藏侧边栏 -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- 主侧边栏标签 -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!--
        default-active：活动菜单颜色
        collapse：侧边栏隐藏
        background-color： 背景颜色
        text-color：菜单中文本颜色
        unique-opened： 是否唯一打开
        active-text-colo： 活动文本颜色
        collapse-transition： 隐藏过渡
        mode="vertical"：绑定变量
       -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    // 获取vuex中getter中的属性的值
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    // 活动菜单
    activeMenu() {
      // 获取当前路由对象
      const route = this.$route
      // 获取meta对象 和路径对象
      const { meta, path } = route
      // 如果设置路径，侧边栏将突出显示您设置的路径
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    // 显示logo
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    // scss颜色变量
    variables() {
      return variables
    },
    // 是否关闭侧边栏
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
