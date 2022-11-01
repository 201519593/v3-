<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        v-model.trim="kw"
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        v-fofo
        @update:model-value="inputFn"
        @search="searchFn"
      />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length !== 0">
      <div
        class="sugg-item"
        v-for="(item, index) in suggestList"
        :key="index"
        v-html="lightFn(item, kw)"
        @click="suggestClickFn(item)"
      ></div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clearFn" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(item, index) in history"
          :key="index"
          @click="historyClickFn(item)"
          >{{ item }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, watch } from 'vue'
import { setStorage, getStorage } from '@/utils/storage'
const { proxy } = getCurrentInstance()
// 搜索关键字
const kw = ref('')
// 防抖定时器
const timer = ref(null)
// 建议列表
const suggestList = ref([])
// 输入框变化事件
const inputFn = (value) => {
  // 防抖
  clearTimeout(timer.value)
  if (kw.value.length === 0) {
    suggestList.value = []
  } else {
    timer.value = setTimeout(async () => {
      const { data } = await proxy.$http.suggestListAPI({ q: kw.value })
      suggestList.value = data.data.options
    }, 300)
  }
}
// 处理搜索结果高亮
const lightFn = (originStr, target) => {
  // originStr 原来字符串
  // target 关键字
  // 字符串方法 replace()
  if (originStr) {
    const reg = new RegExp(target, 'ig')
    return originStr.replaceAll(reg, (match) => {
      // match：匹配中的原字符串
      return `<span style="color:red;">${match}</span>`
    })
  }
}
// 搜索历史
const history = ref(JSON.parse(getStorage('history')) || [])

// 封装跳转函数
const moveFn = (value) => {
  // 路由跳转在watch之前执行，所以让路由跳转设置定时器，转异步任务
  setTimeout(() => {
    proxy.$router.push({
      path: `/search_result/${value}`
    })
  }, 0)
}
// 搜索跳转
// 输入框回车 输入字，搜索结果页
// 点击联想菜单 点击文字 搜索结果页
// 点击历史记录 点击文字 搜索结果页
const searchFn = (value) => {
  if (value.length > 0) {
    // 保存关键字
    history.value.push(value)
    moveFn(value)
  }
}
// 联想菜单点击事件
const suggestClickFn = (value) => {
  // 保存关键字
  history.value.push(value)
  moveFn(value)
}
// 历史记录点击事件
const historyClickFn = (value) => {
  proxy.$router.push({
    path: `/search_result/${value}`
  })
}
// 清除历史记录
const clearFn = () => {
  history.value = []
}
// 深度监听历史搜索记录
watch(
  () => history.value,
  (newval, oldval) => {
    // 立刻覆盖式保存到本地
    // 搜索记录去重
    // 会自动清理重复的元素，返回无重复的set对象
    // const theSet = new Set(history.value)
    // 转回数组
    // const arr = Array.from(theSet)
    // 第二种方法
    const arr = [...new Set(history.value)]
    setStorage('history', JSON.stringify(arr))
  },
  { deep: true }
)

</script>
<script>
export default {
  name: 'Search'
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}
/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
