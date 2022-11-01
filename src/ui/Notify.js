// 基于vant进行二次封装
// 封装通知方法
// import { Notify } from 'vant'
// import 'vant/es/notify/style'
// export default Notify

import 'vant/es/toast/style'
import { Toast } from 'vant'
// 如果传的值不符合组件配置，则自己判断
export default ({ type, message }) => {
  if (type === 'danger') {
    type = 'fail'
  }
  Toast({
    type,
    message
  })
}
