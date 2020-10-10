// 用户路由处理模块
const express = require('express');
const router = express.Router();

// 导入用户路由处理函数模块
const userRouterHandler = require('../routerHandler/user');

// 导入用户信息验证模块和验证包
const expressJoi = require('@escook/express-joi');
const { regAndLogin_schema } = require('../schema/user');

// 挂载用户注册路由，并验证表单数据
router.post('/reguser', expressJoi(regAndLogin_schema), userRouterHandler.reguser);

// 挂载用户登录路由，并验证表单数据
router.post('/login', expressJoi(regAndLogin_schema), userRouterHandler.login);

// 导出路由模块
module.exports = router;