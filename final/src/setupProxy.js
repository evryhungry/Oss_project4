const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/exos-api',
        createProxyMiddleware({
            target: 'https://ecos.bok.or.kr',
            changeOrigin: true,
            pathRewrite: { '^/exos-api': '' },
        })
    );
};
