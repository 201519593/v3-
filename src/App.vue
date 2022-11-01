<template>
  <router-view v-slot="{ Component }">
  <!-- 控制路由无需缓存 -->
    <keep-alive exclude="Search,SearchResult,ArticleDetail,UserEdit">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup>

</script>

<style></style>
