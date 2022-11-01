<template>
  <div class="home_container">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
  <!-- 底部导航 -->
  <div>
    <van-tabbar route>
      <van-tabbar-item icon="home-o" to="/layout/home">首页</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/layout/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
</script>

<style lang="less" scoped>
.home_container {
  padding-bottom: 50px;
}
.van-tabbar {
  border-top: 1px solid #f8f8f8;
}
</style>
