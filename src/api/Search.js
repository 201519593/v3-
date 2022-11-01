import request from './request'
// 搜索建议列表
// 搜索 - 联想菜单
export const suggestListAPI = ({ q }) => {
  return request({
    url: '/v1_0/suggestion',
    params: {
      q: q
    }
  })
}
// 搜索结果
export const searchResult = ({ page = 1, per_page = 10, q }) =>
  request({
    url: '/v1_0/search',
    method: 'get',
    params: {
      page,
      per_page,
      q
    }
  })
