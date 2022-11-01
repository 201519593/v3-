import { setStorage, getStorage } from '@/utils/storage'
const state = {
  // 用户信息 默认从本地提权
  user: JSON.parse(getStorage('user')) || {}
}
const mutations = {
  // 存储用户信息
  SETUSER (state, value) {
    state.user = value
    setStorage('user', JSON.stringify(value))
  }
}
const actions = {}
const getters = {}
export default {
  state,
  mutations,
  actions,
  getters
}
