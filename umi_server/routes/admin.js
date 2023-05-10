const Router = require("koa-router");
const router = new Router(); // 使用路由模块化管理
const crypto = require("crypto"); // 导入加密模块
const jwt = require("jsonwebtoken");
const adminModel = require("../model/adminModel"); // 导入数据库模型

router.get("/test", (ctx) => {
  ctx.type = "html";
  ctx.body = "<h1>test</h1>";
});

/*
 * 注册：http://localhost:3030/admin/register
 * 步骤如下：
 * （1）获取用户的用户名和密码
 * （2）创建MD5摘要算法的对象，利用该对象对密码进行加密
 * （3）将加密后的密码保存到数据库中
 */
router.post("/register", (ctx) => {
  const { request, response } = ctx;
  let id=request.body.id;
  let username = request.body.username; // 获取用户名
  let password = request.body.password; // 获取密码
  // 创建MD5对象
  let md5 = crypto.createHash("md5");
  // 对密码进行加密，"hex"表示密码是十六进制的字符串
  let newPwd = md5.update(password).digest("hex");
  // 将用户名和密码保存到数据库中
  console.log(username, newPwd);
  adminModel
    .create({
      id: id,
      username: username,
      password: newPwd,
    })
    .then((result) => {
      // 创建成功后传递的数据
      ctx.response.body = {
        code: 1000,
        msg: "注册成功",
      };
    })
    .catch((err) => {
      console.log(err);
      ctx.response.body = {
        code: 1002,
        msg: "注册失败",
      };
    });
});

/*
 * 登录：http://localhost:3030/admin/login
 * 步骤如下：
 * （1）获取用户输入的用户名和密码
 * （2）使用MD5加密用户输入的密码
 * （3）将用户名与加密后的密码与数据库中的用户名和密码进行对比
 * （4）对比成功，则是合法用户，生成token，然后将token和其他的信息一起打包给客户端
 * （5）对比不成功，非法用户，不生成token，相应给客户端的信息不包含token
 */
router.post("/login", (ctx) => {
  const { request, response } = ctx;
  // 在服务器端以对象的方式将用户名和密码接收
  let user = request.body;
  // 获取对象中的用户名和密码
  let username = user.username;
  let password = user.password;
  // 创建MD5对象
  let mds = crypto.createHash("md5");
  // 对密码进行加密，密码是十六进制的字符串
  let newPwd = mds.update(password).digest("hex");
  // 查询
  adminModel
    .findAll({
      where: {
        // 查找用户名
        username: username,
      },
    })
    .then((data) => {
      // 用户名可能相同，因此可能查找多条记录，这时data是一个数组，因此在设计注册时，必须保证用户名不重复
      if (data.length !== 0) {
        // 查询到了数据，用户名存在
        if (data[0].password == newPwd) {
          // 密码相同
          // 合法用户，生成token
          // jwt.sign()传入要生成token信息的对象，其中的"jmcbp"可以让token信息更加难以破解
          let newToken = jwt.sign({ ...data[0] }, "jmcbp", {
            expiresIn: 1440, // token的过期时间
          });
          // 将token和其他信息打包后相应给客户端
          ctx.response.body = {
            code: 1000,
            msg: "登录成功",
            token: newToken,
          };
        } else {
          // 密码不相同
          ctx.response.body = {
            code: 1002,
            msg: "密码错误",
          };
        }
      } else {
        // 没有查询到数据
        ctx.response.body = {
          code: 1002,
          msg: "用户不存在",
        };
      }
    });
});

module.exports = (app) => {
  app.use(router.routes()).use(router.allowedMethods());
};
