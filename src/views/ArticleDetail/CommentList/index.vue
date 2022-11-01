<template>
  <div>
    <!-- 评论列表 -->
    <div
      class="cmt-list"
      :class="{
        'art-cmt-container-1': isShowCmtInput,
        'art-cmt-container-2': !isShowCmtInput,
      }"
    >
      <!-- 评论的 Item 项 -->
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        offset="50"
      >
        <div
          class="cmt-item"
          v-for="obj in commentList.results"
          :key="obj.com_id"
        >
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo" alt="" class="avatar" />
              <span class="uname">{{ obj.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="16"
                color="red"
                v-if="obj.is_liking"
                @click="likeFn(true, obj)"
              />
              <van-icon
                name="like-o"
                size="16"
                color="gray"
                v-else
                @click="likeFn(false, obj)"
              />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body" v-html="obj.content"></div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ timeAgo(obj.pubdate) }}</div>
        </div>
      </van-list>
    </div>
    <!-- 发表评论 -->
    <div>
      <!-- 底部添加评论区域 - 1 -->
      <div class="add-cmt-box van-hairline--top" v-if="isShowCmtInput">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
        <div class="ipt-cmt-div" @click="toggleShow">发表评论</div>
        <div class="icon-box">
          <van-badge
            :content="
              commentList.total_count === 0 ? '' : commentList.total_count
            "
            max="99"
          >
            <van-icon
              name="comment-o"
              size="0.53333334rem"
              @click="commentClickFn"
            />
          </van-badge>
          <van-icon name="star-o" size="0.53333334rem" />
          <van-icon
            name="share-o"
            size="0.53333334rem"
            @click="showShare = true"
          />
        </div>
      </div>
      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea
          placeholder="友善评论、理性发言、阳光心灵"
          v-fofo
          @blur="blurFn"
          v-model.trim="comText"
        ></textarea>
        <van-button type="default" :disabled="!comText" @click="sendFn"
          >发布</van-button
        >
      </div>
      <!-- 分享面板 -->
      <van-share-sheet
        v-model:show="showShare"
        title="立即分享给好友"
        :options="options"
      />
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref } from 'vue'
import { timeAgo } from '@/utils/date'
const { proxy } = getCurrentInstance()
// ------------------------------------------------------------------------------
// 偏移量 为id
const offset = ref(null)
// 评论列表
const commentList = ref([])
// 获取评论api
const getCommentsList = async () => {
  const { data } = await proxy.$http.commentsList({
    id: proxy.$route.query.art_id,
    offset: offset.value
  })
  commentList.value = data.data
  // 拿到最后的评论id
  lastId.value = commentList.value.last_id
}
// ------------------------------------------------------------------------------
// 点赞
const likeFn = async (value, obj) => {
  obj.is_liking = !value
  if (value) {
    // 用户点红心
    // 取消点赞
    await proxy.$http.commentDisLikingAPI({
      comId: obj.com_id
    })
  } else {
    // 用户点灰心
    // 进行点赞
    await proxy.$http.commentLikingAPI({
      comId: obj.com_id
    })
  }
}
// ------------------------------------------------------------------------------
// 控制发表评论切换
const isShowCmtInput = ref(true)
onMounted(() => {
  getCommentsList()
})
// 显示评论框
const toggleShow = () => {
  isShowCmtInput.value = false
}
// 评论框失去焦点
const blurFn = () => {
  setTimeout(() => {
    isShowCmtInput.value = true
  }, 0)
}
// 点击评论标签 滚动到评论区域
const commentClickFn = () => {
  // const articleHeight = document.querySelector('.article-container').scrollHeight
  // // 滚动到屏幕的最底端，如果没有内容则不滚动
  // window.scrollTo(0, articleHeight)
  goTop()
}
// 回到评论顶部
const goTop = () => {
  document.querySelector('.like-box').scrollIntoView({
    behavior: 'smooth'
  })
}
// 发表评论
const comText = ref('')
// 发送评论
const sendFn = async () => {
  const { data } = await proxy.$http.commentSend({
    id: proxy.$route.query.art_id,
    content: comText.value
  })
  // console.log(res)
  // getCommentsList()
  // 第二种直接插入
  commentList.value.results.unshift(data.data.new_obj)
  // 增加评论数量
  commentList.value.total_count++
  // 回到第一条评论
  goTop()
}
// ------------------------------------------------------------------------------
// 评论的加载更多
const loading = ref(false)
const finished = ref(false)
// 分页
const lastId = ref(null)
const onLoad = async () => {
  if (commentList.value.results) {
    // 请求下一页数据
    const { data } = await proxy.$http.commentsList({
      id: proxy.$route.query.art_id,
      offset: lastId.value
    })
    // 新值和旧值合并
    commentList.value.results = [
      ...commentList.value.results,
      ...data.data.results
    ]
    // 评论总数量
    commentList.value.total_count = data.data.total_count
    // 分页id
    lastId.value = data.data.last_id
    if (data.data.last_id === null) {
      finished.value = true
    }
    // 加载状态取消
    loading.value = false
  } else {
    loading.value = false
  }
}

// 分享面板
const showShare = ref(false)
const options = ref([
  { name: '微信', icon: 'wechat' },
  { name: '微博', icon: 'weibo' },
  { name: '复制链接', icon: 'link' },
  { name: '分享海报', icon: 'poster' },
  { name: '二维码', icon: 'qrcode' }
])
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
