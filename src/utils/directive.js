// 全局指令
// 自定义指令 封装
const directive = {
  install (app) {
    app.directive('fofo', {
      mounted (el) {
        // DOM.nodeName可以拿到标签名字
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          const input = el.querySelector('input')
          const textArea = el.querySelector('textarea')
          if (input) {
            input.focus()
          } else if (textArea) {
            textArea.focus()
          }
        }
      },
      updated (el) {
        // DOM.nodeName可以拿到标签名字
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          const input = el.querySelector('input')
          const textArea = el.querySelector('textarea')
          if (input) {
            input.focus()
          } else if (textArea) {
            textArea.focus()
          }
        }
      }
    })
  }
}
export default directive
