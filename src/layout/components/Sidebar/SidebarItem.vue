<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'                       // 导入路径
import { isExternal } from '@/utils/validate' // 用于判断是外部的路径
import Item from './Item'                     // 迭代icon与title
import AppLink from './Link'                  // 应用关联 用于切换外部链接显示方法
import FixiOSBug from './FixiOSBug'           // 用于修复IOS设备鼠标离开bug

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object 路由对象
    item: {
      type: Object,
      required: true
    },
    // 是否嵌套
    isNest: {
      type: Boolean,
      default: false
    },
    // 基本路径
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: 渲染函数重构
    this.onlyOneChild = null
    return {}
  },
  methods: {
    // 有一个子路由
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          // 临时设置（如果只有一个子路显示子路由并使用）
          this.onlyOneChild = item
          return true
        }
      })

      // 当只有一个子路由器时，默认显示子路由器
      if (showingChildren.length === 1) {
        return true
      }

      // 如果没有要显示的子路由器，则显示父级
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    // 解析路径
    resolvePath(routePath) {
      // 判断是否是外部的路径
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      // 返回当前也解析好的路径
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
