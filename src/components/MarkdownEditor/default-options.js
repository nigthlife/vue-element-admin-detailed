// doc: https://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html#ToastUIEditor
// 默认选项
export default {
  minHeight: '500px',            // 最小高度
  previewStyle: 'vertical',      // 预览风格   vertical 垂直
  useCommandShortcut: true,      // 使用命令快捷键
  useDefaultHTMLSanitizer: true, // 使用默认html清洁
  usageStatistics: false,        // 使用情况统计
  hideModeSwitch: false,         // 隐藏模式开关
  toolbarItems: [                // 工具栏选项按钮布局顺序
    'heading',  // 文字标题
    'bold',     // 文字加粗
    'italic',   // 文字倾斜
    'strike',   // 文字删除线
    'divider',  // 分割线
    'hr',       // 水平分隔线
    'quote',    // 引述
    'divider',  // 分割线
    'ul',       // 无序列表
    'ol',       // 有序列表
    'task',     // 任务
    'indent',   // 向右缩进
    'outdent',  // 向左缩进
    'divider',  // 分割线
    'table',    // 插入表格
    'image',    // 插入图标
    'link',     // 引用链接
    'divider',  // 分割线
    'code',     // 代码
    'codeblock' // 代码块
  ]
}
