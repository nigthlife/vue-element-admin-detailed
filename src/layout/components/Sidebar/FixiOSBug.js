export default {
  computed: {
    // 获取应用设备
    device() {
      return this.$store.state.app.device
    }
  },
  mounted() {
    // In order to fix the click on menu on the ios device will trigger the mouseleave bug
    // 为了修复ios设备上点击菜单会触发鼠标离开的bug
    // https://github.com/PanJiaChen/vue-element-admin/issues/1135
    this.fixBugIniOS()
  },
  methods: {
    // 修复IOSbug函数
    fixBugIniOS() {
      // 获取子菜单对象
      const $subMenu = this.$refs.subMenu
      if ($subMenu) {
        // 处理鼠标离开
        const handleMouseleave = $subMenu.handleMouseleave
        $subMenu.handleMouseleave = (e) => {
          if (this.device === 'mobile') {
            return
          }
          handleMouseleave(e)
        }
      }
    }
  }
}
