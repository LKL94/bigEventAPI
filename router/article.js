// 用户文章管理路由模块
const express = require('express');
const router = express.Router();

// 导入路由处理函数模块
const artcileHandler = require('../routerHandler/article');

// 导入用户信息验证模块和验证包
const expressJoi = require('@escook/express-joi');
const { addArticle_schema, getArticleList_schema, deleteArticleById_schema, getArticleById_schema, updateArticle_schema } = require('../schema/article');

// 使用 multer 来解析 multipart/form-data 格式的表单数据
// 导入解析 formdata 格式表单数据的包
const multer = require('multer');
// 导入处理路径的核心模块
const path = require('path');
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../upload') });

// 挂载发表新文章路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
// 通过 express-joi 自动验证 req.body 中的文本数据
// 通过 if 判断手动验证 req.file 中的文件数据
router.post('/add', [upload.single('cover_img'), expressJoi(addArticle_schema)], artcileHandler.addArticle);

// 挂载获取文章的列表数据路由
router.get('/list', expressJoi(getArticleList_schema), artcileHandler.getArticleList);

// 挂载根据 Id 删除文章数据路由
router.get('/delete/:id', expressJoi(deleteArticleById_schema), artcileHandler.deleteArticleById);

// 挂载根据 Id 获取文章数据路由
router.get('/:id', expressJoi(getArticleById_schema), artcileHandler.getArticleById);

// 挂载根据 Id 更新文章信息的路由
router.post('/edit', [upload.single('cover_img'), expressJoi(updateArticle_schema)], artcileHandler.updateArticleById);

// 导出路由模块
module.exports = router;