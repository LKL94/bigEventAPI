// 服务器实例模块
const express = require('express');
const app = express();
const port = 80;

// 导入cors 并配置
const cors = require('cors');
app.use(cors());

// 导入解析表单数据的express内置中间件
app.use(express.urlencoded({ extended: false }));

// 导入验证规则包，创建错误处理中间件处理验证错误消息
const joi = require('@hapi/joi');

// 导入解析token的包和配置参数
const expressJWT = require('express-jwt');
const config = require('./config');

// 优化res.send()
app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    res.send({ status, message: err instanceof Error ? err.message : err });
  }
  next();
});

// 注册全局中间件，解析token
app.use(expressJWT({ secret: config.secretkey }).unless({ path: [/^\/api/] }));

// 使用 express.static() 中间件，将 uploads 目录中的图片托管为静态资源
app.use('/upload', express.static('./upload'));

// 导入用户处理路由模块
const userRouter = require('./router/user');
// 导入用户个人中心路由模块
const userinfoRouter = require('./router/userinfo');
// 导入文章分类路由模块
const artcateRouter = require('./router/artcate');
// 导入文章管理路由模块
const articleRouter = require('./router/article');

// 注册用户处理路由
app.use('/api', userRouter);
// 注册用户个人中心路由
app.use('/my', userinfoRouter);
// 注册文章分类路由
app.use('/my/article', artcateRouter);
// 注册文章管理路由
app.use('/my/article', articleRouter);

// 错误处理中间件
app.use((err, req, res, next) => {
  // 验证规则不通过提示的错误
  if (err instanceof joi.ValidationError) return res.cc(err.message);
  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！');
  return res.cc(err);
});

app.listen(port, () => console.log(`Example app listening on http://127.0.0.1`))