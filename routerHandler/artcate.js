// 文章分类路由处理函数模块
// 导入数据库处理模块
const db = require('../db/index');

// 导出获取文章分类路由处理函数
module.exports.getArtcate = (req, res) => {
  // 定义查询SQL语句并执行
  const selectSQL = 'select * from ev_artcates where is_delete=0 order by id';
  db.query(selectSQL, (err, results) => {
    if (err) return res.cc(err);
    if (results.length <= 0) return res.cc('获取文章分类失败！');
    res.send({
      status: 0,
      message: '获取文章分类成功！',
      data: results
    });
  });
}

// 导出新增文章分类路由处理函数
module.exports.addArtcate = (req, res) => {
  // 定义插叙数据库语句并执行，查看是否在数据库中有相同的分类名和别名
  const selectSQL = 'select * from ev_artcates where name=? or alias=?';
  db.query(selectSQL, [req.body.name, req.body.alias], (err, results) => {
    if (err) return res.cc(err);

    // 判断有重名的四种情况
    // if (results.length === 2) return res.cc('分类名或者别名被占用，请更换后重试！');
    if (results.length === 2 || results.length === 1 && req.body.name === results[0].name && req.body.alias === results[0].alias) return res.cc('分类名或者别名被占用，请更换后重试！');
    if (results.length === 1 && req.body.name === results[0].name) return res.cc('分类名被占用，请更换后重试！');
    if (results.length === 1 && req.body.alias === results[0].alias) return res.cc('分类别名被占用，请更换后重试！');

    // name和alias都可以使用
    // 定义新增文章分类SQL语句并执行
    const insertSQL = 'insert into ev_artcates set?';
    db.query(insertSQL, req.body, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) res.cc('新增文章分类失败！');
      res.cc('新增文章分类成功！', 0);
    });
  });
}

// 导出根据 Id 删除文章分类路由处理函数
module.exports.deleteArtcateById = (req, res) => {
  // 定义标记删除SQL语句并执行
  const signDeleteSQL = 'update ev_artcates set is_delete=1 where id=?';
  db.query(signDeleteSQL, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('删除文章分类失败！');

    res.cc('删除文章分类成功！', 0);
  });
}

// 导出根据 Id 获取文章分类数据路由处理函数
module.exports.getArtcateById = (req, res) => {
  // 定义查询SQL语句并执行
  const selectSQL = 'select * from ev_artcates where id=? ';
  db.query(selectSQL, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc('获取文章分类失败！');
    if (results[0].is_delete === 1) return res.cc('文章分类已被删除！');
    res.send({
      status: 0,
      message: '获取文章分类成功！',
      data: results[0]
    });
  });
}

// 导出根据 Id 更新文章分类数据路由处理函数
module.exports.updateArtcateById = (req, res) => {
  // 定义插叙数据库语句并执行，查看是否在数据库中有相同的分类名和别名
  const selectSQL = 'select * from ev_artcates where Id!=? and (name=? or alias=?)';
  db.query(selectSQL, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
    if (err) return res.cc(err);

    // 判断有重名的四种情况
    // if (results.length === 2) return res.cc('分类名或者别名被占用，请更换后重试！');
    if (results.length === 2 || results.length === 1 && req.body.name === results[0].name && req.body.alias === results[0].alias) return res.cc('分类名或者别名被占用，请更换后重试！');
    if (results.length === 1 && req.body.name === results[0].name) return res.cc('分类名被占用，请更换后重试！');
    if (results.length === 1 && req.body.alias === results[0].alias) return res.cc('分类别名被占用，请更换后重试！');

    // name和alias都可以使用
    // 定义更新文章分类SQL语句并执行
    const updateSQL = 'update ev_artcates set ? where Id=? and is_delete=0';
    db.query(updateSQL, [req.body, req.body.Id], (err, results) => {
      if (err) return res.cc(err);
      console.log(results);
      if (results.affectedRows !== 1) return res.cc('更新文章分类失败！');
      res.cc('更新文章分类成功！', 0);
    });
  });
}