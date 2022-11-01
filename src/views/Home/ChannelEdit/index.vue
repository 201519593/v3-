<template>
  <div>
    <!-- 弹出层的头部区域 -->
    <van-config-provider :theme-vars="themeVars">
      <van-nav-bar title="频道管理">
        <template #right>
          <van-icon name="cross" size="0.37333334rem" color="white" @click="closeFn" />
        </template>
      </van-nav-bar>
    </van-config-provider>
    <!-- 我的频道 -->
    <div class="my-channel-box">
      <div class="channel-title">
        <span
          >我的频道
          <span class="small-title">
            点击{{ isEdit ? '删除' : '进入' }}频道
          </span>
        </span>
        <span @click="editFn">{{ isEdit ? '完成' : '编辑' }}</span>
      </div>
      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="item in UserList" :key="item.id" @click="userChannelClickFn(item)">
          <div class="channel-item van-hairline--surround">
            {{ item.name }}
            <!-- 删除的徽标 -->
            <van-badge
              color="transparent"
              class="cross-badge"
              v-show="isEdit && item.id !== 0"
            >
              <template #content>
                <van-icon
                  name="cross"
                  class="badge-icon"
                  color="#cfcfcf"
                  size="0.32rem"
                />
              </template>
            </van-badge>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 更多频道 -->
    <div class="more-channel-box">
      <div class="channel-title">
        <span>点击添加更多频道：</span>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">
        <van-col
          span="6"
          v-for="item in UncheckedList"
          :key="item.id"
          @click="moreFn(item)"
        >
          <div class="channel-item van-hairline--surround">{{ item.name }}</div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue'
// 主题颜色
const themeVars = {
  NavBarBackgroundColor: '#007bff',
  NavBarTitleTextColor: 'white'
}
// 接收列表数据
defineProps({
  UserList: Array,
  UncheckedList: Array
})
// 定义自定义事件
const emit = defineEmits(['AddChannelEV', 'removeChannelEV', 'closeEV', 'update:modelValue'])
// 定义一个编辑按钮的变量
const isEdit = ref(false)
// 点击编辑按钮，切换
const editFn = () => {
  isEdit.value = !isEdit.value
}
// 点击更多频道，添加
const moreFn = (item) => {
  if (isEdit.value === true) { // 处于编辑状态
    emit('AddChannelEV', item)
  }
}
// 用户选择频道点击
const userChannelClickFn = (item) => {
  if (isEdit.value === true) { // 处于编辑状态，执行删除命令
    if (item.id !== 0) {
      emit('removeChannelEV', item)
    }
  } else {
    // 关闭弹出层
    emit('closeEV', false)
    emit('update:modelValue', item.id)
  }
  // 触发v-model绑定的input事件
  // 把值传出去绑定给v-model对应的vue变量
  // v-model本质是父给子传递一个modelValue的值，
  // 通过update:modelValue 可以进行事件的更新
}
// 关闭频道列表
const closeFn = () => {
  // 关闭弹出层
  emit('closeEV', false)
  isEdit.value = false
}
</script>

<style scoped lang="less">
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-header {
  height: 90px;
  text-align: center;
  font-size: 14px;
  position: relative;
  .title {
    width: 100%;
    position: absolute;
    bottom: 15px;
  }
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
  }
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 5px;
}

/*删除的微标 */
.cross-badge {
  position: absolute;
  right: 5px;
  top: 5px;
  border: none;
}

/*提示文字 */
.small-title {
  font-size: 10px;
  color: gray;
}
</style>
