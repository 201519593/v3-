import request from './request'
import { getStorage } from '@/utils/storage'

// 登录
export const login = ({ mobile, code }) =>
  request({
    url: '/v1_0/authorizations',
    method: 'post',
    data: { mobile, code }
  })
// 登录-刷新token
export const getNewToken = () => request({
  url: '/v1_0/authorizations',
  method: 'put',
  headers: {
    // 请求拦截器里面统一携带的是token，而这次请求需要携带refresh_token
    // axios请求拦截器判断，就是为了这种情况准备
    Authorization: 'Bearer ' + getStorage('refresh_token')
  }
})
// 用户未登录，会返回默认频道列表
export const getUserChannelsAPI = () =>
  request({
    url: '/v1_0/user/channels'
  })
