// 封装本地存储
// 整个项目使用localStorage sessionStorage cookie
// 只需要改变这里
export const setStorage = (key, value) => {
  localStorage.setItem(key, value)
}
export const getStorage = (key) => {
  return localStorage.getItem(key)
}
export const removeStorage = (key) => {
  localStorage.removeItem(key)
}
