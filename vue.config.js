module.exports = {
  outputDir: "demo",
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  devServer: {
    proxy: {
      '/api': {
        target: 'https://npm-stat.com',//后端接口地址
        changeOrigin: true,//是否允许跨越
      }
    }
  }
}