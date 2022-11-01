<template>
  <div>
    <!-- Header 区域 -->
    <van-config-provider
      :theme-vars="{
        NavBarBackgroundColor: '#007bff',
        NavBarTitleTextColor: '#fff',
        NavBarIconColor: '#fff',
      }"
    >
      <van-nav-bar
        fixed
        title="文章详情"
        left-arrow
        @click-left="$router.back()"
      />
    </van-config-provider>
      <!-- loading -->
  <van-loading color="#0094ff" size="24px"  vertical v-if="!artObj.content">加载中...</van-loading>
    <!-- 文章信息区域 -->
    <div class="article-container" v-else>
      <!-- 文章标题 -->
      <h1 class="art-title">{{ artObj.title }}</h1>

      <!-- 用户信息 -->
      <van-cell
        center
        :title="artObj.aut_name"
        :label="timeAgo(artObj.pubdate)"
      >
        <template #icon>
          <img :src="artObj.aut_photo" alt="" class="avatar" />
        </template>
        <template #default>
          <div>
            <van-button
              type="info"
              size="mini"
              v-if="artObj.is_followed"
              @click="followFn(true)"
              >已关注</van-button
            >
            <van-button
              icon="plus"
              type="info"
              size="mini"
              plain
              v-else
              @click="followFn(false)"
              >关注</van-button
            >
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="artObj.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button
          icon="good-job"
          type="danger"
          size="small"
          v-if="artObj.attitude === 1"
          @click="loveFn(true)"
          >已点赞</van-button
        >
        <van-button
          icon="good-job-o"
          type="danger"
          plain
          size="small"
          v-else
          @click="loveFn(false)"
          >点赞</van-button
        >
      </div>
    </div>
  </div>
  <CommentList></CommentList>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref } from 'vue'
import { timeAgo } from '@/utils/date'
import CommentList from './CommentList'
const { proxy } = getCurrentInstance()

// 保存文章信息
const artObj = ref({})
onMounted(async () => {
  const { data } = await proxy.$http.ArticleDetail({
    article_id: proxy.$route.query.art_id
  })
  artObj.value = data.data
})

// 点击关注
const followFn = async (value) => {
  // value=true 已关注
  // 切换按钮
  artObj.value.is_followed = !value
  if (value) {
    // 已关注
    await proxy.$http.userUnFollow({
      id: artObj.value.aut_id
    })
  } else {
    // 未关注
    await proxy.$http.userFollow({
      id: artObj.value.aut_id
    })
  }
}
// 点击点赞
const loveFn = async (value) => {
  if (value) {
    artObj.value.attitude = 0
    // 已点赞
    // 取消点赞
    await proxy.$http.unLikeArticle({
      id: artObj.value.art_id
    })
  } else {
    artObj.value.attitude = 1
    // 未点赞 进行点赞
    await proxy.$http.likeArticle({
      id: artObj.value.art_id
    })
  }
}
</script>
<script>
export default {
  name: 'ArticleDetail'
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  :deep(img) {
    width: 100%;
  }
  :deep(pre) {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
.van-loading {
  text-align: center;
  padding-top: 46px;
}
</style>
