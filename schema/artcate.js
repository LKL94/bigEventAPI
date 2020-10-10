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

// 定义验证文章分类名称和别名的规则
const name = joi.string().required();
const alias = joi.string().required();

// 导出验证规则  --新增文章分类
module.exports.addArtcate_schema = {
  body: {
    name,
    alias
  }
}

// 定义验证id的规则
const id = joi.number().integer().min(1).required();

// 导出验证规则  --根据 Id 删除文章分类
module.exports.deleteArtcateById_schema = {
  params: {
    id
  }
}

// 导出验证规则  --根据 Id 获取文章分类
module.exports.getArtcateById_schema = {
  params: {
    id
  }
}

// 导出验证规则  --根据 Id 更新文章分类
module.exports.updateArtcateById_schema = {
  body: {
    Id: id,
    name,
    alias
  }
}