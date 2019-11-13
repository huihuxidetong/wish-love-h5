module.exports = {
    devServer: {
        proxy: { // 配置跨域
            '/mobile': {
                //要访问的跨域的api的域名
                target:'http://localhost:8320/mobile/',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/mobile': ''
                }
            }
        }
    }
}