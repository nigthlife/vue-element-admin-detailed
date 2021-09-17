import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings' // 默认设置

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  // 自定义主题
  theme: variables.theme,
  // 默认显示右侧设备面板
  showSettings: showSettings,
  // 默认开启窗口记录查看
  tagsView: tagsView,
  // 默认不固定标题
  fixedHeader: fixedHeader,
  // 默认不显示侧边栏logo
  sidebarLogo: sidebarLogo
}

const mutations = {
  // 修改设置
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  // 修改设置
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  // 命名空间, 可使用模块名/模块中的mutation。或者actions
  namespaced: true,
  state,
  mutations,
  actions
}

