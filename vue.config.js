const { defineConfig } = require('@vue/cli-service')
const { VantResolver } = require('unplugin-vue-components/resolvers')
const ComponentsPlugin = require('unplugin-vue-components/webpack')
module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭sourcemap
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [VantResolver()]
      })
    ]
  },
  // 配置打包文件路径 打包时必须开启，不然加载不了本地js，css资源
  publicPath: './'

})
