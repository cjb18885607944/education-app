const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  publicPath: "/attendance/",
  transpileDependencies: true,
  devServer: {
    port: 8080, // 前端服务端口
    proxy: {
      "/attendance": {
        target: "http://yyh.qingjuetest.xin",
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) => {
          console.log("Proxying request:", req.url);
        },
        onProxyRes: (proxyRes, req, res) => {
          console.log("Received response for:", req.url);
        },
      },
    },
  },
});
