<template>
  <!-- 一条文章单元格 -->
  <van-cell @click="emit('click')">
    <!-- 标题区域的插槽 -->
    <template #title>
      <div class="title-box">
        <!-- 标题 -->
        <span>{{ artObj.title }}</span>
        <!-- 单图 -->
        <img
          v-if="artObj.cover.type === 1"
          class="thumb"
          v-lazy="artObj.cover.images[0]"
        />
          <!-- <template v-slot:error>图片走丢了</template> -->
        <!-- </img> -->
      </div>
      <!-- 多图 -->
      <div class="thumb-box" v-if="artObj.cover.type > 1">
        <img
          v-for="(imgUrl, index) in artObj.cover.images"
          :key="index"
          class="thumb"
          v-lazy="imgUrl"
        />
          <!-- <template v-slot:error>图片走丢了</template> -->
        <!-- </img> -->
      </div>
    </template>
    <!-- label 区域的插槽 -->
    <template #label>
      <div class="label-box">
        <div>
          <span>{{ artObj.aut_name }}</span>
          <span>{{ artObj.comm_count }}评论</span>
          <span>{{ timeAgo(artObj.pubdate) }}</span>
        </div>
        <!-- 反馈按钮 -->
        <van-icon name="cross" @click.stop="isShow" v-if="showClose" />
      </div>
    </template>
  </van-cell>
  <van-action-sheet
    v-model:show="show"
    :actions="actions"
    @select="onSelect"
    @cancel="cancelFn"
    teleport="body"
    :cancel-text="bottomText"
  />
</template>

<script setup>
import { timeAgo } from '@/utils/date'
import { firstActions, secondActions } from '@/api/report'
import { defineProps, ref, defineEmits } from 'vue'
const props = defineProps({
  artObj: Object,
  showClose: {
    type: Boolean,
    default: true
  }
})
// 定义自定义事件 子向父传递数据
const emit = defineEmits(['dislikeEV', 'reportEV', 'click'])
// 反馈面板逻辑------------------------------------------------------------------------
const show = ref(false) // 显示或隐藏反馈面板
const actions = ref(firstActions) // 面板选项
const bottomText = ref('取消')
// 点击反馈按钮
const isShow = () => {
  // 展示选项
  show.value = true
  // 把actions选项数据渲染成初次数据
  actions.value = firstActions
  bottomText.value = '取消'
}
// 点击切换选项
const onSelect = (action, item) => {
  if (action.name === '反馈垃圾内容') {
    // 切换actions里面的数据
    actions.value = secondActions
    bottomText.value = '返回'
  } else if (action.name === '不感兴趣') {
    // 触发自定义事件
    emit('dislikeEV', props.artObj.art_id)
    // 关闭反馈面板
    show.value = false
  } else {
    // 二级反馈选项
    emit('reportEV', props.artObj.art_id, action.value)
    actions.value = firstActions
    // 关闭反馈面板
    show.value = false
  }
}
// 控制取消按钮
const cancelFn = () => {
  // 如果点击的是返回按钮,则不关闭选项
  if (bottomText.value === '返回') {
    // 强制展示选项
    show.value = true
    // 更改选项
    actions.value = firstActions
    // 更改返回为取消
    bottomText.value = '取消'
  }
}

</script>

<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}
/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
