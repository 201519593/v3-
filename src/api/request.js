import axios from 'axios'
import router from '@/router'
import Notify from '@/ui/Notify'
import { getToken, removeToken } from '@/utils/token'
// import { getNewToken } from '@/api'
const request = axios.create({
  // 请求地址
  baseURL: 'http://geek.itheima.net',
  //  请求超时
  timeout: 6000
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 统一携带token
  // 判断本地有token再携带，判断具体api/index。js里如果没有携带Authorization，再添加
  // 没有是undefined null具体的值赋值才是空
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use((response) => {
  // http响应码2xx 3xx
  // 对响应数据做点什么
  return response
}, async (error) => {
  // http响应码4xx 5xx
  if (error.response.status === 401) {
    Notify({ type: 'warning', message: '身份已过期' })
    // 先清空token，才能放行
    // 方式1 清除token 跳转登录页
    removeToken()
    router.replace(`/login?path=${router.currentRoute.value.fullPath}`)
    // router.replace('/login')

  // 方式2 使用refresh_token换回新的token，用户无感知
  // const { data } = await getNewToken()
  //   // 1.更新token
  // setToken(data.data.token)
  //   // 2.更新新的token在请求头
  // error.config.headers.Authorization = `Bearer ${data.data.token}`
  //   // 3.再次发起请求
  //   // error.config就是上一次配置对象
  //   // 结果return回原本逻辑页面调用的地方
  // return axios(error.config)
  } else if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
    // 判断刷新的refresh过期
    // 清除所有本地存储
    localStorage.clear()
    Notify({ type: 'warning', message: '身份已过期' })
    router.replace('/login')
  }
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default ({ url, method = 'get', params = {}, data = {}, headers = {} }) => {
  return request({
    url,
    method,
    params,
    data,
    headers
  })
}
