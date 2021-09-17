module.exports = {
  title: 'Vue Element Admin',

  /**
   * @type {boolean} true | false
   * @description 是否显示设置右侧面板
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description 是否需要窗口记录查看
   */
  tagsView: true,

  /**
   * @type {boolean} true | false 用于固定导航栏状态 
   * @description 是否固定标题 启用后，表的标题将是粘性的，
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description 是否显示侧边栏logo
  sidebarLogo: false,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description 显示错误日志组件
   *  默认仅在生产环境中使用
   * 可以通过右边方式设置 ['production', 'development']
   */
  errorLog: 'production'
}
