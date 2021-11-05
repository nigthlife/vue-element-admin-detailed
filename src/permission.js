import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar 进度条（内置函数）
import 'nprogress/nprogress.css' // progress bar style 进度条样式
import { getToken } from '@/utils/auth' // get token from cookie 获取cookie中获取token
import getPageTitle from '@/utils/get-page-title' // 获取页面的标题

NProgress.configure({ showSpinner: false }) // NProgress Configuration 页面顶部加载进度条配置

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist  没有重定向白名单

// 前置守卫
router.beforeEach(async(to, from, next) => {
  // start progress bar 加载进度条
  NProgress.start()

  // 将即将要进入的目标的路由对象中的meat中的标题设置为当前网页标题
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in 判断用户是否已经登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page 如果已登录，重定向到主页
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939 完成进度条
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      // 判断用户是否通过getinfo获取了权限角色是否已经登录
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        // 以登录放行
        next()
      } else {
        try {
          // get user info  获取用户信息
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles 生成基于角色的可访问路由图
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes 动态添加可访问的路由
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete hack方法，以确保地址路由是完整的
          // 设置replace: true，这样导航就不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 删除令牌并转到登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly 在免登录白名单，直接进入
      next()
    } else {
      // 其他没有访问权限的页面被重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

// 后置守卫（hook）
// 在离开当前路由前调用
router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})
