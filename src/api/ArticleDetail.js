import request from './request'
// 获取文章列表
export const getAllArticelList = ({ channel_id, timestamp }) =>
  request({
    url: '/v1_0/articles',
    method: 'get',
    params: {
      channel_id,
      timestamp
    }
  })
// 文章获取详情
export const ArticleDetail = ({ article_id }) =>
  request({
    url: `/v1_0/articles/${article_id}`,
    method: 'get'
  })

// 文章 - 反馈 - 不感兴趣
export const dislikeArticle = (artId) =>
  request({
    url: '/v1_0/article/dislikes',
    method: 'post',
    data: {
      target: artId
    }
  })
// 文章 - 反馈 - 反馈垃圾内容
export const reportArticle = ({ artId, type }) =>
  request({
    url: '/v1_0/article/reports',
    method: 'post',
    data: {
      target: artId,
      type: type,
      // 附加内容，可以再加一个输入框
      remark: ''
    }
  })

// 文章点赞
export const likeArticle = ({ id }) =>
  request({
    url: '/v1_0/article/likings',
    method: 'post',
    data: {
      target: id
    }
  })
// 文章取消点赞
export const unLikeArticle = ({ id }) =>
  request({
    url: `/v1_0/article/likings/${id}`,
    method: 'delete'
  })
// 文章评论
export const commentsList = ({ id, offset = null, limit = 10 }) =>
  request({
    url: '/v1_0/comments',
    method: 'get',
    params: {
      type: 'a',
      source: id,
      offset,
      limit
    }
  })
// 评论 - 喜欢
export const commentLikingAPI = ({ comId }) => {
  return request({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: {
      target: comId
    }
  })
}
// 评论-取消喜欢
export const commentDisLikingAPI = ({ comId }) => {
  return request({
    url: `/v1_0/comment/likings/${comId}`,
    method: 'DELETE'
  })
}
// 发送评论
export const commentSend = ({ id, content, art_id = null }) => {
  // data不会忽略参数
  // params才会忽略null
  const obj = {
    target: id,
    content: content
  }
  if (art_id != null) {
    obj.art_id = art_id
  }
  return request({
    url: '/v1_0/comments',
    method: 'post',
    data: obj
  })
}

// 关注作者
export const userFollow = ({ id }) =>
  request({
    url: '/v1_0/user/followings',
    method: 'post',
    data: {
      target: id
    }
  })
// 取消关注作者
export const userUnFollow = ({ id }) =>
  request({
    url: `/v1_0/user/followings/${id}`,
    method: 'delete'
  })
