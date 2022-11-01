import { getToken } from '@/utils/token'
export default [
  { path: '/', redirect: '/layout/home' },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login'),
    beforeEnter: (to, from) => {
      // reject the navigation
      if (getToken()?.length > 0) {
        return { path: '/layout/home' }
      } else {
        return true
      }
    }
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName: "Layout" */ '@/views/Layout'),
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "Home" */ '@/views/Home')
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "User" */ '@/views/User')
      }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "Search" */ '@/views/Search')
  },
  {
    path: '/search_result/:kw',
    component: () =>
      import(
        /* webpackChunkName: "SearchResult" */ '@/views/Search/SearchResult'
      )
  },
  {
    path: '/article_detail',
    component: () =>
      import(/* webpackChunkName: "ArticleDetail" */ '@/views/ArticleDetail')
  },
  // 用户编辑
  {
    path: '/user_edit',
    component: () =>
      import(/* webpackChunkName: "UserEdit" */ '@/views/User/UserEdit')
  },
  // 小思同学
  {
    path: '/chat',
    component: () => import(/* webpackChunkName: "Chat" */ '@/views/Chat')
  }
]
