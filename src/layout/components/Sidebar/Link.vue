<template>
  <!-- is指定这个component渲染成为指定的标签类型  -->
  <!-- 绑定链接地址 -->
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate' // 判断是否是外部path

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    // 判断是否是外部路径https
    isExternal() {
      return isExternal(this.to)
    },
    type() {
      // 是外部HTTPS返回a标签
      if (this.isExternal) {
        return 'a'
      }
      // 是本地路径返回一个router-link，它最终会被渲染成一个a标签
      return 'router-link'
    }
  },
  methods: {
    // 链接方法
    linkProps(to) {
      // 判断是否是外部HTTPS路径
      if (this.isExternal) {
        return {
          // 链接地址
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      // 不是外部路径直接返回
      return {
        to: to
      }
    }
  }
}
</script>
