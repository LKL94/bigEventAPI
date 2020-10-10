// 用户文章管理路由处理函数模块

// 导入数据库连接模块
const db = require('../db/index');
// 导入path模块处理路径
const path = require('path');

// 导出发表新文章路由处理函数
module.exports.addArticle = (req, res) => {
  // 打印使用multer解析出来的文件
  // console.log(req.file);
  // console.log(req.body);
  // 通过 if 判断手动验证 req.file 中的文件数据
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！');

  // 所有数据都验证通过
  // 定义添加到数据库的对象
  const articleInfo = {
    // 把req.body中的属性全部解析并赋值给articleInfo
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/upload', req.file.filename),
    // 文章发布时间
    pub_date: new Date(),
    // 文章作者的Id
    author_id: req.user.id
  }

  // 定义添加数据的SQL语句并执行
  const insertSQL = 'insert into ev_articles set ?';
  db.query(insertSQL, articleInfo, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('发布新文章失败！');

    res.cc('发布新文章成功！', 0);
  })
}

// 导出获取文章列表的路由处理函数
module.exports.getArticleList = (req, res) => {
  // 获取提交过来的表单数据
  const artInfo = req.query;
  //limit公式: limit (pagenum - 1) * pagesize, pagesize
  // 查询页码的起始数据和结束数据
  const startNum = (artInfo.pagenum - 1) * artInfo.pagesize;
  const endNum = artInfo.pagesize;
  // console.log(artInfo);
  // 定义查询SQL语句并执行,关联数据表查询
  const selectSQL = `select ea.Id,ea.title,ea.pub_date,ea.state,ec.name as cate_name
  from ev_articles as ea left join ev_artcates as ec on ea.cate_id = ec.Id  `;
  // 查询符合条件的数据数量
  const selectTotalSQL = `select count(*) as total from ev_articles as ea  `;

  // 定义查询条件语句 cate_id 和 state同时存在
  const cate_idAndStateSQL = ` where ea.is_delete=0 and ea.cate_id=? and ea.state=?`;
  // 定义查询参数 cate_id 和 state同时存在
  const allParamsSQL1 = [artInfo.cate_id, artInfo.state];
  const allParamsSQL2 = [artInfo.cate_id, artInfo.state, startNum, endNum];

  // 定义查询条件语句 仅存在cate_id
  const cate_idSQL = ` where ea.is_delete=0 and ea.cate_id=? `;
  // 定义查询参数 仅存在cate_id
  const cate_idParamsSQL1 = artInfo.cate_id;
  const cate_idParamsSQL2 = [artInfo.cate_id, startNum, endNum];

  // 定义查询条件语句 仅存在state
  const stateSQL = `where ea.is_delete=0 and ea.state=?`;
  // 定义查询参数 仅存在state
  const stateParamsSQL1 = artInfo.state;
  const stateParamsSQL2 = [artInfo.state, startNum, endNum];

  // 定义查询条件语句 cate_id 和 state同时不存在

  // 根据不同的条件执行不同的SQL语句
  const querySQL = function (condition, paramsSQL1, paramsSQL2) {
    db.query(selectTotalSQL + condition, paramsSQL1, (err, results) => {
      if (err) return res.cc(err);
      // 查询出来的数量
      let total = results[0].total;
      db.query(selectSQL + condition + ` limit ?, ?`, paramsSQL2, (err, results) => {
        if (err) return res.cc(err);
        res.send({
          status: 0,
          message: '获取文章列表成功！',
          data: results,
          total: total
        });
      });
    });
  }
  if (artInfo.cate_id) {
    console.log(222);
  }
  // console.log(artInfo);
  // 根据提交数据的四种不同情况分别执行不同的SQL查询语句
  if (artInfo.cate_id !== null && artInfo.state === void (0)) {
    querySQL(cate_idSQL, cate_idParamsSQL1, cate_idParamsSQL2);
  } else if (artInfo.state !== null && artInfo.cate_id === void (0)) {
    querySQL(stateSQL, stateParamsSQL1, stateParamsSQL2);
  } else if (artInfo.cate_id !== null && artInfo.state !== null) {
    querySQL(cate_idAndStateSQL, allParamsSQL1, allParamsSQL2);
  } else if (artInfo.cate_id == void (0) && artInfo.state == void (0)) {
    console.log(111);
    // db.query(selectTotalSQL + ` where ea.is_delete=0`, (err, results1) => {
    //   // console.log(results);
    //   if (err) return res.cc(err);
    //   // 查询出来的数量
    //   let total = results1[0].total;
    //   //limit公式: limit (pagenum - 1) * pagesize, pagesize
    //   db.query(selectSQL + ` where ea.is_delete=0 limit ?, ?`, [0, 2], (err, results2) => {
    //     if (err) return res.cc(err);
    //     console.log(results2);
    //     res.send({
    //       status: 0,
    //       message: '获取文章列表成功！',
    //       data: results2,
    //       total: total
    //     });
    //   });
    // });
  }
}

// 导出根据 Id 删除文章数据的路由处理函数
module.exports.deleteArticleById = (req, res) => {
  // 定义标记删除文章数据SQL语句并执行
  const signDeleteSQL = 'update ev_articles set is_delete=1 where id=?';
  db.query(signDeleteSQL, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('删除文章失败！');

    res.cc('删除文章成功！', 0);
  });
}

// 导出根据 Id 获取文章数据的路由处理函数
module.exports.getArticleById = (req, res) => {
  // 定义标记删除文章数据SQL语句并执行
  const selectSQL = 'select * from ev_articles where id=? and is_delete=0';
  db.query(selectSQL, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc('获取文章数据失败！');

    res.send({
      status: 0,
      message: '获取文章成功！',
      data: results[0]
    });
  });
}

// 导出根据 Id 更新文章信息的路由处理函数
module.exports.updateArticleById = (req, res) => {
  // 通过 if 判断手动验证 req.file 中的文件数据
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！');
  // console.log(req.file);
  // console.log(req.body);
  // 所有数据都验证通过
  // 定义添加到数据库的对象
  const articleInfo = {
    // 把req.body中的属性全部解析并赋值给articleInfo
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/upload', req.file.fieldname),
    // Id
    Id: req.body.Id
  }

  // 定义更新文章数据的SQL语句并执行
  const insertSQL = 'update ev_articles set ? where Id=?';
  db.query(insertSQL, [articleInfo, req.body.Id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc('修改文章失败！');

    res.cc('修改文章成功！', 0);
  })
}