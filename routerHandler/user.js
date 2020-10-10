// 用户路由处理函数模块
// 导入数据库处理模块
const db = require('../db/index');
// 导入数据加密第三方包
const bcrypt = require('bcryptjs');
// 导入生成token字符串的包
const jwt = require('jsonwebtoken');
// 导入生成token的配置参数，生效时间和加密解密字符串
const config = require('../config');

// 导出用户注册路由处理函数
module.exports.reguser = (req, res) => {
  // 接收客户端提交的信息对象
  const userinfo = req.body;

  // 查询数据库，看是否用户名被占用
  const selectSQL = 'select * from ev_users where username=?';
  db.query(selectSQL, userinfo.username, (err, results) => {
    if (err) return res.cc(err);
    if (results.length > 0) return res.cc('用户名被占用，请更换后重试！');

    // 没有错误，代表用户名可以使用，然后把用户密码进行加密后存储到数据库
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);
    // console.log(userinfo.password);
    const insertSQL = 'insert into ev_users set?';
    db.query(insertSQL, { username: userinfo.username, password: userinfo.password }, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后重试！');
      res.cc('注册成功！', 0);
    });
  })
}

// 导出用户登录路由处理函数
module.exports.login = (req, res) => {
  // 查询数据库，看是否能匹配到提交的用户名，然后在比对密码是否正确
  const selectSQL = 'select * from ev_users where username=?';
  db.query(selectSQL, req.body.username, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc('用户名错误，登陆失败！');

    // 判断提交的密码和查询到的密码是否一致，利用bcrypt.compareSync(),返回的是布尔值
    const compareResult = bcrypt.compareSync(req.body.password, results[0].password);

    if (!compareResult) return res.cc('密码错误，登陆失败！');

    // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
    const user = { ...results[0], password: '', user_pic: '' }
    // 生成token
    const tokenStr = jwt.sign(user, config.secretkey, { expiresIn: config.expiresIn });

    // 将token发送给客户端
    res.send({
      status: 0,
      message: '登陆成功',
      token: 'Bearer ' + tokenStr
    });
  });
}