<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    // 图标
    icon: {
      type: String,
      default: ''
    },
    // 标题头
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    // 获取参数对象
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      // 判断图标是否element-ui中的图标
      if (icon.includes('el-icon')) {
        // 使用i标签添加图标
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        // 不是element-ui直接添加外部icon路径
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }
    // 判断是否存在标题头
    if (title) {
      // 添加标题头
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    // 返回拼接后的数组标签
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
