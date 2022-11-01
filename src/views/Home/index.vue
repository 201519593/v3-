<template>
  <!-- 头部导航 -->
  <div>
    <van-config-provider :theme-vars="themeVars">
      <van-nav-bar fixed>
        <template #left>
          <img src="@/assets/toutiao_logo.png" class="logo" />
        </template>
        <template #right>
          <van-icon name="search" size="0.48rem" color="#fff" @click="moveSearchPageFn" />
        </template>
      </van-nav-bar>
    </van-config-provider>
  </div>
  <!-- tab栏导航 -->
  <div class="main">
    <van-tabs
      v-model:active="channelId"
      animated
      swipeable
      sticky
      offset-top="1.226667rem"
      @change="channelChangeFn"
    >
      <van-tab
        :title="item.name"
        v-for="item in UserChannelList"
        :key="item.id"
        :name="item.id"
      >
        <ArticleList :channelId="channelId"></ArticleList>
      </van-tab>
    </van-tabs>
    <!-- 编辑频道图标 -->
    <van-icon
      name="plus"
      size="0.37333334rem"
      class="moreChannels"
      @click="showPopup"
    />
    <!-- 频道管理弹出层 -->
    <van-popup
      v-model:show="show"
      teleport="body"
      :style="{ height: '100%', width: '100%' }"
    >
      <ChannelEdit
        :UserList="UserChannelList"
        :UncheckedList="unCheckChannelList"
        @AddChannelEV="AddChannelEV"
        @removeChannelEV="removeChannelEV"
        @closeEV="closeEV"
        v-model="channelId"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref, computed, onActivated, onDeactivated } from 'vue'
// import { onBeforeRouteLeave } from 'vue-router'
import ArticleList from './ArticleList'
import ChannelEdit from './ChannelEdit'
const { proxy } = getCurrentInstance()
// 主题颜色
const themeVars = {
  NavBarBackgroundColor: '#007bff'
}
// ----------------------------------------------------------------------------------------------------
// 所有频道列表
const AllChannelList = ref([])
// 获取所有频道列表
const getAllChannelsAPI = async () => {
  const { data } = await proxy.$http.getAllChannelsAPI()
  AllChannelList.value = data.data.channels
}
// 存储用户列表数据
const UserChannelList = ref([])
// 获取用户频道列表
const getUserChannelsAPI = async () => {
  const { data } = await proxy.$http.getUserChannelsAPI()
  UserChannelList.value = data.data.channels
}
// 对比所有频道和用户频道，进行计算
const unCheckChannelList = computed(() => {
  // const newArr = AllChannelList.value.filter(item => {
  //   const index = UserChannelList.value.findIndex(a => {
  //     return a.id === item.id
  //   })
  //   // 如果找到了
  //   if (index > -1) {
  //     return false
  //   } else {
  //     return true
  //   }
  // })
  // return newArr
  return AllChannelList.value.filter(
    (bigObj) =>
      UserChannelList.value.findIndex(
        (smallObj) => smallObj.id === bigObj.id
      ) === -1
  )
})
// 更改用户频道列表
const AddChannelEV = async (obj) => {
  UserChannelList.value.push(obj)
  // 把最新的数据，发送给后台
  // 转换字段
  // 推荐频道不能传递
  // 筛选出不是推荐频道的
  const newUserChannelList = UserChannelList.value.filter(item => item.id !== 0)
  const theNewArr = newUserChannelList.map((obj, index) => {
    const newObj = { ...obj } // 浅拷贝
    delete newObj.namenew
    newObj.seq = index
    return newObj // 让map方法把新对象收集起来形成一个新数组
  })
  // newUserChannelList.forEach((item, index) => {
  //   // delete删除键值对
  //   delete item.name
  //   item.seq = index
  // })
  await proxy.$http.UpdateChannel({ channels: theNewArr })
}
// 删除频道的事件
const removeChannelEV = async (item) => {
  const index = UserChannelList.value.findIndex(obj => obj.id === item.id)
  UserChannelList.value.splice(index, 1)
  // 1、把现在用户数组的数据，再覆盖式的发给后台
  // 需要把上面的更新数组过程，封装一个函数，add和remove里调用
  // 2、只调用删除接口
  await proxy.$http.removeChannel({ channelId: item.id })
  // 204 无返回内容
}

// 标签id
const channelId = ref(0)
// 控制弹出层显示和隐藏
const show = ref(false)
// 点击加号，显示弹出层
const showPopup = () => {
  show.value = true
}

// 关闭弹出层
const closeEV = (value) => {
  show.value = value
}
// ----------------------------------------------------------------------------------------------
// 点击搜索跳转
const moveSearchPageFn = () => {
  proxy.$router.push('/search')
}
// --------------------------------------------------------------------------------------------------
// 保存滚动状态
// 路由meta数据会重置
const scroll1 = ref(0)
const scrollFn = () => {
  proxy.$route.meta.top = document.documentElement.scrollTop || document.body.scrollTop
  scroll1.value = document.documentElement.scrollTop || document.body.scrollTop
  // 保存每个频道的滚动距离
  channelScrollTObj.value[channelId.value] = document.documentElement.scrollTop
  // console.log(channelScrollTObj.value)
}
onActivated(() => {
  window.addEventListener('scroll', scrollFn)
  document.documentElement.scrollTop = scroll1.value
  document.body.scrollTop = scroll1.value
})
onDeactivated(() => {
  window.removeEventListener('scroll', scrollFn)
})
onMounted(() => {
  getUserChannelsAPI()
  getAllChannelsAPI()
})
// 保存每个频道的滚动位置
const channelScrollTObj = ref({})
// 切换频道的事件
const channelChangeFn = () => {
  // tab切换时，组件内部把容器设置位0，滚动条没有高度，回到顶部
  // 切换来的一瞬间，没有高度，滚动事件从底下上来也被触发了，所以才把数据设置位0
  // 切换来的一瞬间高度位0，设置无效
  // 需要延迟设置
  proxy.$nextTick(() => {
    document.documentElement.scrollTop = channelScrollTObj.value[channelId.value]
    document.body.scrollTop = channelScrollTObj.value[channelId.value]
  })
}
</script>

<style lang="less" scoped>
.logo {
  width: 100px;
  height: 30px;
}
.main {
  padding-top: 46px;
  :deep(.van-tabs__line) {
    background: #007bff;
  }
}
// 设置 tabs 容器的样式
:deep(.van-tabs__wrap) {
  padding-right: 30px;
  background-color: #fff;
}

// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
</style>
