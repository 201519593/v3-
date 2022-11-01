import request from './request'

// 用户 - 基本信息（我的页面）
export const userInfoAPI = () => {
  return request({
    url: '/v1_0/user'
  })
}
// 用户- 个人资料(就为了获取生日)
export const userProfileAPI = () => {
  return request({
    url: '/v1_0/user/profile'
  })
}
// 用户-更新数据-头像
export const updateUserProfile = (formdata) =>
  request({
    // 如果请求体是formdata
    // content-type，axios会发现数据请求体是表单对象，它不会转换成json字符串
    // 也不会带content-type：application/json 而是交给浏览器，浏览器发现请求体是formdata会自己携带content-type
    // content-type：application/json axios会转成json字符串，前提是data请求体是对象，会转成json字符串 发给后台
    // content-type：multipart/form-data 浏览器携带，前提是data请求体必须是formdata类型对象
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data: formdata
  })
// 用户-更新基本资料
export const userProfile = (dataObj) => {
  const obj = {
    name: '',
    gender: '',
    birthday: '',
    intro: ''
  }
  // 遍历对象，如果传入的参数没有值，则删除；否则让obj进行赋值
  for (const k in obj) {
    if (dataObj[k] === undefined) {
      delete obj[k]
    } else {
      obj[k] = dataObj[k]
    }
  }
  return request({
    // data不会忽略null，params会忽略null
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: obj
  })
}
