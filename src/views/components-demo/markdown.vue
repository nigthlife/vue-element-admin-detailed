<template>
  <div class="components-container">
    <!-- 头部介绍语 -->
    <aside>Markdown is based on
      <a href="https://github.com/nhnent/tui.editor" target="_blank">tui.editor</a> ，simply wrapped with Vue.
      <a
        target="_blank"
        href="https://panjiachen.github.io/vue-element-admin-site/feature/component/markdown-editor.html"
      >
        Documentation </a>
    </aside>

    <!-- <div class="editor-container">
      <el-tag class="tag-title">
        基础:
      </el-tag>
      <markdown-editor v-model="content1" height="300px" />
    </div> -->

    <!-- <div class="editor-container">
      <el-tag class="tag-title">
        定制工具栏:
      </el-tag>
      <markdown-editor v-model="content3" :options="{ toolbarItems: ['heading','bold','italic']}" />
    </div> -->

    <div class="editor-container">
      <el-tag class="tag-title">
        I18n:
      </el-tag>
      <el-alert
        :closable="false"
        title="您可以更改管理系统的语言以查看效果"
        type="success"
      />
      <markdown-editor ref="markdownEditor" v-model="content4" :language="language" height="300px" />
    </div>

    <div class="editor-container">
      <el-tag class="tag-title">
        Markdown 模式:
      </el-tag>
      <markdown-editor ref="markdownEditor" v-model="content2" :language="language" :options="{hideModeSwitch:true,previewStyle:'tab'}" height="200px" />
    </div>

    <el-button style="margin-top:80px;" type="primary" icon="el-icon-document" @click="getHtml">
      Get HTML
    </el-button>
    <div v-html="html" />
  </div>
</template>

<script>
import MarkdownEditor from '@/components/MarkdownEditor' // 导入markdown编辑组件

// 测试数据
const content = `
**This is test**

* vue
* element
* webpack

`
export default {
  name: 'MarkdownDemo',
  components: { MarkdownEditor },
  data() {
    return {
      content1: content,
      content2: content,
      content3: content,
      content4: content,
      html: '',
      // 语言类型列表
      languageTypeList: {
        'en': 'en_US',
        'zh': 'zh_CN',
        'es': 'es_ES'
      }
    }
  },
  computed: {
    // 获取语言
    language() {
      return this.languageTypeList['zh']
    }
  },
  methods: {
    getHtml() {
      this.html = this.$refs.markdownEditor.getHtml()
      console.log(this.html)
      console.log(this.content4)
      console.log(this.content2)
    }
  }
}
</script>

<style scoped>
.editor-container{
  margin-bottom: 30px;
}
.tag-title{
  margin-bottom: 5px;
}
</style>
