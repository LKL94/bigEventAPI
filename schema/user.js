// 用户信息验证模块
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

// 定义用户名和密码的表单数据验证规则
const username = joi.string().alphanum().min(1).max(10).required();
const password = joi.string().pattern(/^[\S]{6,16}$/).required();

// 导出验证规则 --登录注册
module.exports.regAndLogin_schema = {
  body: {
    username,
    password
  }
}

// 定义更新用户信息的表单数据验证规则
const id = joi.number().integer().min(1).required();
const nickname = joi.string().min(1).max(10).required();
const email = joi.string().email().required();

// 导出验证规则 --更新用户信息
module.exports.updateUserinfo_schema = {
  body: {
    id,
    nickname,
    email
  }
}

// 导出验证规则 --重置用户密码
module.exports.updatePassword_schema = {
  body: {
    // 使用 password 这个规则，验证 req.body.oldPwd 的值
    oldPwd: password,
    // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
    // 解读：
    // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
    // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
    // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
    newPwd: joi.not(joi.ref('oldPwd')).concat(password),
  },
}

// 定义验证用户头像的表单数据规则
const avatar = joi.string().dataUri().required();

// 导出验证规则 --更换用户头像
module.exports.updateAvatar_schema = {
  body: {
    avatar
  }
}