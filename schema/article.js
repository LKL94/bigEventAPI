// 文章分类验证模块
// 导入验证信息的第三发包
const joi = require('@hapi/joi');

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 定义发布文章提交表单数据验证规则
const title = joi.string().required();
const cate_id = joi.number().integer().min(1).required();
const content = joi.string().required().allow('');
const state = joi.string().valid('已发布', '草稿').required();

// 导出验证规则对象 --发布新文章
module.exports.addArticle_schema = {
  body: {
    title,
    cate_id,
    content,
    state
  }
}

// 定义获取文章列表数据提交的表单数据验证规则
const pagenum = joi.number().integer().min(1).required();
const pagesize = joi.number().integer().min(1).required();
const cate_id_getArtList = joi.number().integer().min(1);
const state_getArtList = joi.string().valid('已发布', '草稿');

// 导出验证规则对象 --获取文章
module.exports.getArticleList_schema = {
  query: {
    pagenum,
    pagesize,
    cate_id: cate_id_getArtList,
    state: state_getArtList
  }
}

// 定义验证id的规则
const id = joi.number().integer().min(1).required();

// 导出验证规则  --根据 Id 删除文章分类
module.exports.deleteArticleById_schema = {
  params: {
    id
  }
}

// 导出验证规则  --根据 Id 获取文章分类
module.exports.getArticleById_schema = {
  params: {
    id
  }
}

// 导出验证规则对象 --更新新文章
module.exports.updateArticle_schema = {
  body: {
    Id: id,
    title,
    cate_id,
    content,
    state
  }
}