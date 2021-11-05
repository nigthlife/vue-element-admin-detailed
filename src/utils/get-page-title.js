import defaultSettings from '@/settings'

// 如果默认设置中的标题为空则设置标题为Vue Admin Admin
const title = defaultSettings.title || 'Vue Element Admin'

// 使用默认导出方式导出一个函数
// pageTitle：路由中的meat对象中的title标题
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    // 拼接标题
    return `${pageTitle} - ${title}`
  }
  // 为空返回标题
  return `${title}`
}
