<template>
  <div>
    <!-- 文章列表 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        offset="50"
      >
        <ArticleItem
          v-for="item in list"
          :key="item.art_id"
          :artObj="item"
          @dislikeEV="dislikeEV"
          @reportEV="reportEV"
          @click="itemClickFn(item.art_id)"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { defineProps, getCurrentInstance, onMounted, ref } from 'vue'
import ArticleItem from '@/components/ArticleItem'
import Notify from '@/ui/Notify'
// 解构vue原型
const { proxy } = getCurrentInstance()
// 接收父组件传递的数据---------------------------------------------------------------
const props = defineProps({
  // 频道id
  channelId: Number
})

// 获取文章列表逻辑--------------------------------------------------------------------------------
// 创建频道列表
const list = ref([])
// 保存返回的时间戳，用于加载更多
const timestamp = ref(+new Date())
// 获取文章列表数据
// 此处不能用load，因为tab会进行预加载，加载两页数据
const getAllArticelList = async () => {
  const { data } = await proxy.$http.getAllArticelList({
    channel_id: props.channelId,
    timestamp: timestamp.value
  })
  //  tiemstamp传递上次的时间戳，然后返回指定位置的往后10条数据
  timestamp.value = data.data.pre_timestamp
  list.value = [...list.value, ...data.data.results]

  // 如果时间戳为空，则为最后一次数据
  if (data.data.pre_timestamp === null) {
    finished.value = true
  }
  // 底部加载状态
  loading.value = false
  // 顶部加载状态
  isLoading.value = false
}

// 触底加载更多逻辑--------------------------------------------------------------------------------
// 底部加载状态
const loading = ref(false)
// 底部完成状态
const finished = ref(false)
// 触底加载事件
// 同时完成获取文章列表数据
const onLoad = () => {
  // immediate-check: 内部不要进行判断而已, 监听滚动事件的代码还在
  if (list.value.length === 0) {
    loading.value = false
    return
  }
  getAllArticelList()
}

// 下拉刷新逻辑-----------------------------------------------------------------------------------
// 下拉刷新方法
const isLoading = ref(false)
const onRefresh = () => {
  // 清空列表，重置时间
  list.value = []
  timestamp.value = +new Date()
  finished.value = false
  getAllArticelList()
}
// -----------------------------------------------------------------------------------
// 反馈不感兴趣的方法
const dislikeEV = async (val) => {
  await proxy.$http.dislikeArticle(val)
  Notify({ type: 'success', message: '反馈成功' })
}
onMounted(() => {
  getAllArticelList()
})
// 反馈垃圾内容
const reportEV = async (id, value) => {
  await proxy.$http.reportArticle({ artId: id, type: value })
  Notify({ type: 'success', message: '举报成功' })
}

// ---------------------------------------------------------------
// 文章单元格点击事件
const itemClickFn = (id) => {
  proxy.$router.push(`/article_detail?art_id=${id}`)
}
</script>
