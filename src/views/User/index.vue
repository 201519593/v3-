<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="$store.state.user.user.photo" alt="" class="avatar" />
        </template>
        <template #title>
          <span class="username">{{ userData.name }}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{ userData.art_count }}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ userData.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{ userData.fans_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/user_edit" />
      <van-cell icon="chat-o" title="小思同学" is-link to="/chat" />
      <van-cell icon="warning-o" title="退出登录" is-link @click="quitFn" />
    </van-cell-group>
  </div>
</template>

<script setup>
import { removeToken } from '@/utils/token'
// 弹出框
import { Dialog } from 'vant'
import { getCurrentInstance, onActivated, ref } from 'vue'
import { useStore } from 'vuex'
const { proxy } = getCurrentInstance()
const store = useStore()
// 用户信息
const userData = ref([])
// 获取用户信息
const getUserData = async () => {
  const { data } = await proxy.$http.userInfoAPI()
  // 存入仓库和本地
  store.commit('SETUSER', data.data)
  userData.value = store.state.user.user
}

// 退出登录的方法
const quitFn = () => {
  Dialog.confirm({
    title: '是否退出登录',
    message: '这就走了？不爱我了吗？'
  })
    .then(() => {
      // on confirm
      removeToken()
      proxy.$router.replace('/login')
    })
    .catch(() => {
      // on cancel
    })
}
onActivated(() => {
  getUserData()
})
// onMounted(() => {
//   getUserData()
// })
</script>

<style scoped lang="less">
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>
