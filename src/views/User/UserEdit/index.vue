<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="userList.photo"
            @click="imageClickFn"
          />
          <!-- file 选择框 -->
          <input
            type="file"
            ref="iptFile"
            v-show="false"
            accept="image/*"
            @change="onFileChange"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="userList.name"
        @click="nameClickFn"
      />
      <van-cell
        title="生日"
        is-link
        :value="userList.birthday"
        @click="dateClickFn"
      />
    </van-cell-group>
  </div>
  <!-- 姓名修改弹窗 -->
  <div>
    <van-dialog
      v-model:show="show"
      title="姓名"
      :beforeClose="Close"
      show-cancel-button
    >
      <van-field
        v-model="inputValue"
        ref="inputName"
        input-align="center"
        placeholder="请输入用户名"
      />
    </van-dialog>
  </div>
  <!-- 时间选择 -->
  <div>
    <van-popup
    v-model:show="showDate"
    position="bottom"
    round
    :style="{height:'50%'}"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="dateCancel"
        @confirm="dateConfirm"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { Dialog } from 'vant'
import Notify from '@/ui/Notify'
import { formatDate } from '@/utils/date'
import { getCurrentInstance, onMounted, ref } from 'vue'
const { proxy } = getCurrentInstance()
const VanDialog = Dialog.Component

// 用户数据
const userList = ref({})
const getData = async () => {
  const { data } = await proxy.$http.userProfileAPI()
  userList.value = data.data
}
// 获取dom input
const iptFile = ref(null)
// 头像点击
const imageClickFn = () => {
  // 触发input
  iptFile.value.click()
}
// 上传文件
const onFileChange = async (e) => {
  // 创建一个formdata对象
  const theFd = new FormData()
  // 请求体中加入参数
  theFd.append('photo', e.target.files[0])
  const { data } = await proxy.$http.updateUserProfile(theFd)
  userList.value.photo = data.data.photo
}

// 姓名修改
const show = ref(false)
// 点击姓名
const nameClickFn = () => {
  show.value = true
  setTimeout(() => {
    // console.log(inputName)
    inputName.value.focus()
  }, 0)
  inputValue.value = userList.value.name
}
// 姓名修改输入框
const inputValue = ref('')
// 获取输入框实例
const inputName = ref(null)
// 弹窗关闭前回调
const Close = async (action) => {
  if (action === 'confirm') {
    // 正则判断
    const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/
    if (reg.test(inputValue.value)) {
      await proxy.$http.userProfile({
        name: inputValue.value
      })
      Notify({ type: 'success', message: '修改成功' })
      userList.value.name = inputValue.value
      return true
    } else {
      Notify({ type: 'warning', message: '用户名只能是1-7位中英文数字组合' })
      return false
    }
  } else {
    return true
  }
}

// 时间选择
const currentDate = ref(new Date())
const minDate = ref(new Date(1920, 0, 1))
const maxDate = ref(new Date())
const showDate = ref(false) // 时间选择弹出层
// 点击时间弹出修改器
const dateClickFn = () => {
  showDate.value = true
  currentDate.value = new Date(userList.value.birthday)
}
// 取消修改日期
const dateCancel = () => {
  showDate.value = false
}
// 确定修改日期
const dateConfirm = async () => {
  await proxy.$http.userProfile({
    birthday: formatDate(currentDate.value)
  })
  Notify({ type: 'success', message: '修改成功' })
  userList.value.birthday = formatDate(currentDate.value)
  showDate.value = false
}
onMounted(() => {
  getData()
})
</script>
<script>
export default {
  name: 'UserEdit'
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
:deep(.van-dialog__content) {
  text-align: center;
}
</style>
