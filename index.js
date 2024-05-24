const express = require('express');

const app = express();
const port = 3000;
const path = require('path');

const { decodeToken } = require('./utils/jwt');

// 跨域
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('X-Powered-By', '3.2.1');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
})


// 使用中间件解析 JSON 请求体  
app.use(express.json());

// 还可以使用中间件解析 urlencoded 请求体（如果需要）  
app.use(express.urlencoded({ extended: true }));

// token判断
app.use((req, res, next) => {
    // 登录、注册不需要token
    if (req.url == '/signin' || req.url == '/signup') {
        next();
        return;
    }
    if(decodeToken(req.headers.authorization)){
        next();
    }else {
        res.send({
            code: 401,
            msg: 'token失效'
        })
    }
})

// 路由
require('./router/index')(app);

// 404
app.use((res, req, next) => {
    let error = new Error('404 Not Found');
    error.status = 404;
    next(error);
})

// 错误处理
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.send(error.message);
})

// 监听端口
app.listen(port, () => {
    console.log(`正在监听端口${port}`);
});