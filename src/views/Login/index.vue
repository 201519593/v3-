<template>
  <div>
    <van-config-provider
      :theme-vars="{
        NavBarBackgroundColor: '#007bff',
        NavBarTitleTextColor: '#fff',
      }"
    >
      <van-nav-bar title="黑马头条-登录" />
    </van-config-provider>
  </div>
  <div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="user.mobile"
          name="手机号"
          label="手机号"
          placeholder="请输入11位手机号"
          required
          :rules="[
            { required: true, message: '请填写手机号' },
            { pattern: pattern1, message: '请输入正确的手机号' },
          ]"
        />
        <van-field
          v-model="user.code"
          type="password"
          name="密码"
          label="密码"
          placeholder="请输入6位密码"
          required
          :rules="[
            { required: true, message: '请填写密码' },
            { pattern: pattern2, message: '请输入正确的验证码' },
          ]"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button
          round
          block
          type="primary"
          :loading="isLoading"
          :disabled="isLoading"
          loading-text="正在登录..."
          native-type="submit"
        >
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, ref } from 'vue'
import Notify from '@/ui/Notify'
import { setToken } from '@/utils/token'
import { setStorage } from '@/utils/storage'
const { proxy } = getCurrentInstance()
// 手机号
// 验证码（写密码 246810）
const user = reactive({
  mobile: '13812345678',
  code: '246810'
})
// 加载状态
const isLoading = ref(false)
// 手机号验证
const pattern1 = /^1[3-9]\d{9}$/
// 验证码
const pattern2 = /^\d{6}$/

// 提交登录信息
const onSubmit = async (values) => {
  try {
    isLoading.value = true
    const { data } = await proxy.$http.login(user)
    Notify({ type: 'success', message: '登录成功' })
    // 存储token
    setToken(data.data.token)
    // 存储refreshtoken
    setStorage('refresh_token', data.data.refresh_token)
    // 跳转路由，一定写在最后
    // 而且尽量延迟操作

    proxy.$router.replace(
      // 控制跳转
      // 这里不能改，改了就不能正确跳转
      proxy.$route.query.path || '/layout/home'
    )
  } catch (err) {
    Notify({ type: 'danger', message: '登录失败' })
  }
  // 网络请求完成
  isLoading.value = false
}
</script>

<style lang="less"></style>
