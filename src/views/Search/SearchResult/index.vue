<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-config-provider
        :theme-vars="{
          NavBarBackgroundColor: '#007bff',
          NavBarTitleTextColor: '#fff',
          NavBarIconColor:'#fff'
        }"
      >
        <van-nav-bar
          title="搜索结果"
          left-arrow
          @click-left="$router.go(-1)"
          fixed
        />
      </van-config-provider>
    </div>
    <!-- 文章列表 -->
    <div>
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        offset="50"
      >
        <ArticleItem
          v-for="obj in articleList"
          :key="obj.art_id"
          :artObj="obj"
          :showClose="false"
          @click="itemClickFn(obj.art_id)"
        ></ArticleItem>
      </van-list>
    </div>
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref } from 'vue'
import ArticleItem from '@/components/ArticleItem'

// import { timeAgo } from '@/utils/date'
const { proxy } = getCurrentInstance()

const articleList = ref([]) // 文章列表数据
const page = ref(1) // 页码
onMounted(async () => {
  const { data } = await proxy.$http.searchResult({
    page: page.value,
    q: proxy.$route.params.kw
  })

  articleList.value = data.data.results
})

// 加载更多
const loading = ref(false) // 加载状态
const finished = ref(false) // 加载完成
const onLoad = async () => {
  if (articleList.value.length > 0) {
    page.value++
    const { data } = await proxy.$http.searchResult({
      page: page.value,
      q: proxy.$route.params.kw
    })
    if (data.data.results.length === 0) {
      finished.value = true
      return
    }
    articleList.value = [...articleList.value, ...data.data.results]
    loading.value = false
  }
}

// 单元格点击事件
const itemClickFn = (id) => {
  // 跳转到详情

  proxy.$router.push(`/article_detail?art_id=${id}`)
}
</script>
<script>
export default {
  name: 'SearchResult'
}
</script>
<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
