<template>
  <div :id="id" />
</template>

<script>
// deps for editor
// import 'codemirror/lib/codemirror.css' // codemirror 代码镜像
// import 'tui-editor/dist/tui-editor.css' // editor ui 编辑样式
// import 'tui-editor/dist/tui-editor-contents.css' // editor content 编辑内容
import 'codemirror/lib/codemirror.css' // Editor's Dependency Style
import '@toast-ui/editor/dist/toastui-editor.css' // Editor's Style

// import Editor from 'tui-editor'
import Editor from '@toast-ui/editor'
import defaultOptions from './default-options' // 导入默认选项参数

export default {
  name: 'MarkdownEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: false, // 不为必须的
      default() {
        return 'markdown-editor-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    options: {         // 创建tui-editor初始化参数
      type: Object,
      default() {
        return defaultOptions
      }
    },
    mode: {            // 默认模式为markdown格式
      type: String,
      default: 'markdown'
    },
    height: {          // 高度
      type: String,
      required: false, // 是否必须设置
      default: '300px' // 默认高度
    },
    language: {        // 语言
      type: String,
      required: false, // 是否必须设置
      default: 'en_US' // https://github.com/nhnent/tui.editor/tree/master/src/js/langs
    }
  },
  data() {
    return {
      editor: null
    }
  },
  computed: {
    // 编辑器选项
    editorOptions() {
      // Object.assign(): 用于将所有可枚举属性的值从一个或多个源对象分配到目标对象
      // 将defaultOptions中options的所有参数迭代出来
      const options = Object.assign({}, defaultOptions, this.options)
      console.log('Object.assign() ============')
      console.log(options)

      // 设置默认编辑类型
      options.initialEditType = this.mode

      // 设置高度
      options.height = this.height

      // 设置语言
      options.language = this.language
      return options
    }
  },
  watch: {
    // 监控value发生改变后执行方法
    value(newValue, preValue) {
      if (newValue !== preValue && newValue !== this.editor.getValue()) {
        // 设置当前编辑新值
        this.editor.setValue(newValue)
      }
    },
    // 语言发生改变执行方法
    language(val) {
      // 重置编辑器
      this.destroyEditor()
      // 初始化编辑器
      this.initEditor()
    },
    // 高度发生改变执行
    height(newValue) {
      // 设置新的高度
      this.editor.height(newValue)
    },
    // 模式发生改变执行
    mode(newValue) {
      // 不更改原有参数，创建新的参数存储模式
      this.editor.changeMode(newValue)
    }
  },
  // 页面初始化执行
  mounted() {
    this.initEditor()
  },
  // 退出时执行
  destroyed() {
    this.destroyEditor()
  },
  methods: {
    // 初始化编辑器
    initEditor() {
      // 创建一个tui-editor对象，并赋值给当然的editor
      this.editor = new Editor({
        // 绑定的编辑器id
        el: document.getElementById(this.id),
        // 设置初始化参数
        ...this.editorOptions,
        //  codeBlockLanguages: ['ruby', 'PHP', 'javascript'],
      })
      // 判断当前value是否为空
      if (this.value) {
        // 不为空设置编辑的内容
        // this.editor.setValue(this.value)
        this.editor.setMarkdown(this.value)
      }
      // 子组件可以使用 $emit 触发父组件的自定义事件
      // 为editor属性绑定change事件
      this.editor.on('change', () => {
        // 触发当前实例上的事件，获取编辑属性中的内容
        this.$emit('input', this.editor.getMarkdown())
      })
    },
    // 销毁编辑器
    destroyEditor() {
      // 如果为空return
      if (!this.editor) return

      // 从事件类型解除绑定change事件
      this.editor.off('change')
      // 删除工具栏项
      this.editor.remove()
    },
    setValue(value) {
      // 设置内容
      // this.editor.setValue(value)
      this.editor.setMarkdown(value)
    },
    getValue() {
      // 获取内容
      // return this.editor.getValue()
      return this.editor.getMarkdown()
    },
    setHtml(value) {
      // 设置html
      this.editor.setHtml(value)
    },
    getHtml() {
      // 获取html
      return this.editor.getHtml()
    }
  }
}
</script>
