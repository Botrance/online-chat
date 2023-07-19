const Router = require("koa-router");
const router = new Router(); // 使用路由模块化管理
const crypto = require("crypto"); // 导入加密模块

const { sign, verify } = require("../utils/jwt");

const userModel = require("../model/user"); // 导入数据库模型

router.get("/test", (ctx) => {
  ctx.type = "html";
  ctx.body = "<h1>test</h1>";
});

router.post("/token", async (ctx) => {
  await verify(ctx.request, ctx.response);
});

router.post("/register", async (ctx) => {
  const { request, response } = ctx;
  const { userName, password, timestamp } = request.body;

  try {
    // 查找具有给定用户名的用户
    const existingUser = await userModel.findOne({
      where: {
        userName: userName,
      },
    });

    // 如果用户存在
    if (existingUser) {
      response.body = {
        code: 110,
        msg: "用户名不能重复",
      };
      return;
    }

    // 如果用户不存在，则创建一个新用户并分配下一个可用 ID
    const lastUser = await userModel.findOne({
      order: [["userId", "DESC"]],
    });

    const nextId = lastUser ? lastUser.userId + 1 : 10000;

    // 使用给定的用户名和密码创建一个新的用户
    const md5 = crypto.createHash("md5");
    const newPwd = md5.update(password).digest("hex");

    const newUser = await userModel.create({
      userId: nextId,
      userName: userName,
      password: newPwd,
      roomUpdate: timestamp ? timestamp : Date.now(),
      friendUpdate: timestamp ? timestamp : Date.now(),
    });

    // 如果用户创建成功
    if (newUser) {
      console.log("注册成功");
      response.body = {
        code: 100,
        data: {
          userId: nextId,
        },
        msg: "注册成功",
      };
    } else {
      console.log("注册失败");
      response.body = {
        code: 101,
        msg: "注册失败",
      };
    }
  } catch (err) {
    console.log("注册失败");
    console.log(err);
    response.body = {
      code: 101,
      msg: "注册失败",
    };
  }
});

router.post("/login", async (ctx) => {
  const { request, response } = ctx;
  // 获取对象中的用户名和密码
  let { userName, password } = request.body;
  // 创建MD5对象
  let mds = crypto.createHash("md5");
  // 对密码进行加密，密码是十六进制的字符串
  let newPwd = mds.update(password).digest("hex");
  // 查询
  await userModel
    .findAll({
      where: {
        // 查找用户名
        userName: userName,
      },
    })
    .then((data) => {
      // 用户名可能相同，因此可能查找多条记录，这时data是一个数组，因此在设计注册时，必须保证用户名不重复
      if (data.length !== 0) {
        // 查询到了数据，用户名存在
        if (data[0].password == newPwd) {
          // 密码相同
          // 合法用户，生成token
          // jwt.sign()传入要生成token信息的对象
          let newToken = sign({ ...data[0] });
          // 将token和其他信息打包后相应给客户端
          console.log("Login success");
          response.body = {
            code: 100,
            userId: data[0].userId,
            msg: "Login success",
            token: newToken,
          };
        } else {
          // 密码不相同
          console.log("Login failed");
          response.body = {
            code: 101,
            msg: "Login failed, please check the userName or the password",
          };
        }
      } else {
        // 没有查询到数据
        console.log("No such user");
        response.body = {
          code: 110,
          msg: "No such user",
        };
      }
    });
});

//还需要一个更换密码
module.exports = router.routes();
