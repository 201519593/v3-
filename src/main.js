import '@/utils/console.js' // 去除打印语句
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import './vant.config'
import 'vant/es/dialog/style'
// 引入flexible，设置根标签字体大小（移动端适配）
import 'amfe-flexible'
import * as API from '@/api/'
import directiveObj from '@/utils/directive'
// 代码高亮
import 'highlight.js/styles/default.css'// 代码高亮的样式
// 图片懒加载
import { Lazyload } from 'vant'
// 打包环境配置
// console.log(process.env)
const app = createApp(App)
app.config.globalProperties.$http = API

app.use(directiveObj)
app.use(Lazyload, {
  error: 'https://img2.baidu.com/it/u=1928736049,3128591086&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333',
  preload: 0.8
})
app.use(store).use(router).mount('#app')
