// 用户个人中心路由处理函数模块
// 导入连接数据库模块
const db = require("../db/index");
// 导入密码加密模块，判断密码是否相同
const bcrypt = require('bcryptjs');

// 获取用户信息路由处理函数
module.exports.getUserinfo = (req, res) => {
  // 定义查询数据库的语句并执行，而且不查询密码
  const selectSQL = 'select id, username, nickname, email,user_pic from ev_users where id=?';

  db.query(selectSQL, req.user.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc('获取用户信息失败！');

    // 获取成功
    res.send({
      status: 0,
      message: '获取用户基本信息成功！',
      data: results[0]
    });
  });
}

// 更新用户基本信息的路由处理函数
module.exports.updateUserinfo = (req, res) => {
  // 定义更新数据库的语句并执行
  const updateSQL = 'update ev_users set? where id=?';
  db.query(updateSQL, [req.body, req.body.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('更新用户失败！');

    res.cc('更新用户成功！', 0)
  });
}

// 重置用户密码的路由处理函数
module.exports.updatePassword = (req, res) => {
  // 查询用户是否存在
  const selectSQL = 'select * from ev_users where id=?';
  db.query(selectSQL, req.user.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc('用户不存在');

    // 判断提交的旧密码是否和数据库中的一致
    const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password);
    if (!compareResult) return res.cc('原密码错误！');
    // 对新密码加密
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
    console.log(newPwd);
    // 更新密码
    const updateSQL = 'update ev_users set password=? where id=?';
    db.query(updateSQL, [newPwd, req.user.id], (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc('重置密码失败！');

      res.cc('重置密码成功！', 0);
    })
  })
}

// 更换用户头像的路由处理函数
module.exports.updateAvatar = (req, res) => {
  // 定义更新数据库语句并执行
  const updateSQL = 'update ev_users set user_pic=? where id=?';
  // console.log(req.body);
  db.query(updateSQL, [req.body.avatar, req.user.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('更换头像失败！');

    res.cc('更换头像成功！', 0)
  });
}