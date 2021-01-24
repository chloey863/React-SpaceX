const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
    // will getting data from "https://n2yo.com/api/"
    app.use(
        '/api', // cross domain accessing; i.e. mapping "/api" to 'https://api.n2yo.com' for calling N2YO API
        createProxyMiddleware({
            target: 'https://api.n2yo.com',
            changeOrigin: true,
        })
    );
};


