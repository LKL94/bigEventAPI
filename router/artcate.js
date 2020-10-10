// 用户文章分类路由模块
const express = require('express');
const router = express.Router();

// 导入路由处理函数的模块
const artcateHandler = require('../routerHandler/artcate');

// 导入用户信息验证模块和验证包
const expressJoi = require('@escook/express-joi');
const { addArtcate_schema, deleteArtcateById_schema, getArtcateById_schema, updateArtcateById_schema } = require('../schema/artcate');


// 挂载获取文章分类路由
router.get('/cates', artcateHandler.getArtcate);

// 挂载新增文章分类路由
router.post('/addcates', expressJoi(addArtcate_schema), artcateHandler.addArtcate);

// 挂载根据 Id 删除文章分类路由
router.get('/deletecate/:id', expressJoi(deleteArtcateById_schema), artcateHandler.deleteArtcateById);

// 挂载根据 Id 获取文章分类路由
router.get('/cates/:id', expressJoi(getArtcateById_schema), artcateHandler.getArtcateById);

// 挂载根据 Id 更新文章分类路由
router.post('/updatecate', expressJoi(updateArtcateById_schema), artcateHandler.updateArtcateById);

module.exports = router;