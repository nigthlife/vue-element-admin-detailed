<template>
  <!-- 导航栏组件 -->
  <!-- separator：设置'el-breadcrumb-item'的分隔符 -->
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <!-- 进入/离开  列表过渡 -->
    <transition-group name="breadcrumb">
      <!-- 迭代导航栏列表数据 -->
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <!--  -->
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <!-- 标题文字 -->
        <!-- click.stop是阻止父节点事件的冒泡，-->
        <!-- click.prevent是阻止自身默认事件的执 -->
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp' // url正则表达式

export default {
  data() {
    return {
      // 导航栏元素列表
      levelList: null
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    // 获取导航栏信息
    getBreadcrumb() {
      // 只显示带有 meta.title 的路由
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      console.log('路由列表为 => ')
      console.log(matched)
      // 取出第一个元素
      const first = matched[0]

      // 设置首页
      if (!this.isDashboard(first)) {
        // 如果第一个元素不为主页设置为主页，并合并俩个数组
        matched = [{ path: '/dashboard', meta: { title: '主页' }}].concat(matched)
      }

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    /**
     * 判断是否是首页
     */
    isDashboard(route) {
      // 获取name值
      const name = route && route.name
      // 为空不是主页
      if (!name) {
        return false
      }
      // 去除俩边空格同时转大写判断是否等于主页name
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    // 编译一个合法url
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      console.log('输出路由为 => ')
      console.log(this.$route)
      // 获取路由参数
      const { params } = this.$route
      // 快速填充 url 字符串的参数值
      var toPath = pathToRegexp.compile(path)
      // 拼接url+参数
      return toPath(params)
    },
    // 链接处理
    handleLink(item) {
      // path: 要去的路径
      const { redirect, path } = item
      // 判断是否需要重定向
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      // 跳转 支持url传递参数
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
