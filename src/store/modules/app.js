import Cookies from 'js-cookie'

const state = {
  sidebar: {
    // 获取cookie中的侧边栏状态，默认为打开状态
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    // 默认没有动画
    withoutAnimation: false
  },
  // 设备为桌面
  device: 'desktop',
  size: Cookies.get('size') || 'medium'
}

const mutations = {
  // 切换侧边栏 点击收缩功能触发
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      // 设置侧边栏状到cookie中
      Cookies.set('sidebarStatus', 1)
    } else {
      // 设置侧边栏状到cookie中
      Cookies.set('sidebarStatus', 0)
    }
  },
  // 自适应触发侧边栏收缩
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  // 切换设备
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  // 设置大小
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  }
}

const actions = {
  // 切换侧边栏
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  // 隐藏侧边栏
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  // 切换设备
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  // 设置大小
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
