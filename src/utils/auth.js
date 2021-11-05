import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

/**
 * 获取名为“ Admin-Token”的cookie
 */
export function getToken() {
  return Cookies.get(TokenKey)
}

/**
 * TokenKey：name
 * token：value
 * @param {令牌} token
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

/**
 * 删除cookie
 * 根据当前cookie的键
 */
export function removeToken() {
  return Cookies.remove(TokenKey)
}
