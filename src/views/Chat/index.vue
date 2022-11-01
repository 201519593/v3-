<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小思同学"></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(item,index) in list" :key="index">
          <!-- 左侧是机器人小思 -->
          <div class="chat-item left" v-if="item.name!=='me'">
            <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
            <div class="chat-pao">{{item.msg}}</div>
          </div>

          <!-- 右侧是当前用户 -->
          <div class="chat-item right" v-else>
            <div class="chat-pao">{{item.msg}}</div>
            <van-image fit="cover" round :src="$store.state.user.user.photo" />
          </div>
       </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field  placeholder="说点什么..." v-model.trim="word">
        <template #button>
          <span  style="font-size:12px;color:#999" @click="sendFn">提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script setup>
import { io } from 'socket.io-client'
import { getToken } from '@/utils/token'
import { onBeforeUnmount, onMounted, ref, watch, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

const list = ref([
  // 只根据 name 属性，即可判断出这个消息应该渲染到左侧还是右侧
  { name: 'xs', msg: 'hi，你好！我是小思' },
  { name: 'me', msg: '我是编程小王子' },
  { name: 'xs', msg: 'hi，你好！我是小思' },
  { name: 'me', msg: '我是编程小王子' },
  { name: 'xs', msg: 'hi，你好！我是小思' },
  { name: 'me', msg: '我是编程小王子' },
  { name: 'xs', msg: 'hi，你好！我是小思' },
  { name: 'me', msg: '我是编程小王子' },
  { name: 'xs', msg: 'hi，你好！我是小思' },
  { name: 'me', msg: '我是编程小王子' },
  { name: 'xs', msg: 'hi，你好！我是小思' },
  { name: 'me', msg: '我是编程小王子' }
])
// 用户输入
const word = ref('')
// socket对象
const socket = ref(null)
// 发送消息
const sendFn = () => {
  if (word.value === '') return
  socket.value.emit('message', {
    msg: word.value,
    timestamp: new Date().getTime()

  })
  // 把消息显示到页面
  list.value.push({
    msg: word.value,
    name: 'me'
  })
  // 清空字符串
  word.value = ''
}
// 拿到最后一个div
const theDiv = ref(null)
// 监听聊天数据，页面滚动
watch(
  () => list.value,
  (newval, oldval) => {
    proxy.$nextTick(() => {
      theDiv.value = document.querySelector('.chat-list>div:last-child')
      theDiv.value.scrollIntoView({ behavior: 'smooth' })
    })
  },
  { deep: true }
)
onMounted(() => {
  // 建立连接
  socket.value = io('http://geek.itheima.net', {
    query: {
      token: getToken()
    },
    transports: ['websocket']
  })
  // 测试是否建立连接
  socket.value.on('connect', () => {
    console.log('连接成功')
  })
  // 接收后端传回的消息
  socket.value.on('message', obj => {
    list.value.push({
      name: 'xs',
      msg: obj.msg
    })
  })
  setTimeout(() => {
    theDiv.value = document.querySelector('.chat-list>div:last-child')
    theDiv.value.scrollIntoView({ behavior: 'smooth' })
  }, 0)
})
onBeforeUnmount(() => {
  // 关闭连接
  socket.value.close()
  socket.value = null
})
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: '';
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
