// import { getToken } from '@/utils/token'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 控制页面滚动行为，重置滚动
  scrollBehavior (to, from, savedPosition) {
    return { y: 0 }
  }
  // scrollBehavior (to, from, savedPosition) {
  //   // 如果有记录页面的滚动行为
  //   if (savedPosition) {
  //     return savedPosition
  //   } else {
  //     return { top: 0 }
  //   }
  // }
})
// 全局前置守卫
// router.beforeEach((to, from) => {
//   // ...
//   // 返回 false 以取消导航
//   if (getToken()?.length > 0 && to.path === '/login') {
//     return { path: '/layout/home' }
//   } else {
//     return true
//   }
// })

export default router
