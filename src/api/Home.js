import request from './request'

// 获取频道列表
export const getAllChannelsAPI = () =>
  request({ url: '/v1_0/channels', method: 'get' })
// 获取用户选择的频道

// 更新覆盖频道
export const UpdateChannel = ({ channels }) =>
  request({
    url: '/v1_0/user/channels',
    method: 'put',
    data: {
      channels: channels
    }
  })
// 删除指定频道
export const removeChannel = ({ channelId }) =>
  request({
    url: `/v1_0/user/channels/${channelId}`,
    method: 'delete'
  })
