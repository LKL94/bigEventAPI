// 用户个人中心路由模块
const express = require('express');
const router = express.Router();

// 导入路由处理函数模块
const userinfoHandler = require('../routerHandler/userinfo');
// 导入规则验证模块
const expressJoi = require('@escook/express-joi');
// 导入用户信息验证模块
const { updateUserinfo_schema, updatePassword_schema, updateAvatar_schema } = require('../schema/user');

// 挂载获取用户基本信息的路由
router.get('/userinfo', userinfoHandler.getUserinfo);

// 挂载更新用户基本信息的路由
router.post('/userinfo', expressJoi(updateUserinfo_schema), userinfoHandler.updateUserinfo);

// 挂载重置用户密码的路由
router.post('/updatepwd', expressJoi(updatePassword_schema), userinfoHandler.updatePassword);

// 挂载更换用户头像的路由
router.post('/update/avatar', expressJoi(updateAvatar_schema), userinfoHandler.updateAvatar);

// 导出路由模块
module.exports = router;

