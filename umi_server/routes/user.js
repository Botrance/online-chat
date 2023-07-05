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
  let { username, password } = request.body;

  let id = "";
  let isInclude = false;
  let retryCount = 0;
  const maxRetries = 3;

  const generateUniqueUUID = async () => {
    let uuid_id = crypto.randomUUID();
    const existingUser = await userModel.findOne({
      where: {
        id: uuid_id,
      },
    });
    if (existingUser) {
      if (retryCount >= maxRetries) {
        response.body = {
          code: 101,
          msg: "Register failed, something wrong , plaese retry!",
        };
        throw new Error("Failed to generate a unique UUID.");
      }
      retryCount++;
      return generateUniqueUUID();
    }
    return uuid_id;
  };

  await userModel
    .findAll({
      where: {
        username: username,
      },
    })
    .then((result) => {
      if (result && result.length) {
        response.body = {
          code: 110,
          msg: "Username cannot be same",
        };
        isInclude = true;
      } else {
        return generateUniqueUUID();
      }
    })
    .then((uuid_id) => {
      if (!isInclude) {
        id = uuid_id;

        // 创建MD5对象
        let md5 = crypto.createHash("md5");
        // 对密码进行加密，"hex"表示密码是十六进制的字符串
        let newPwd = md5.update(password).digest("hex");

        console.log(username, newPwd);

        return userModel.create({
          id: id,
          username: username,
          password: newPwd,
        });
      }
    })
    .then((result) => {
      if (result) {
        // 创建成功后传递的数据
        console.log("Register success");
        response.body = {
          code: 100,
          msg: "Register success",
        };
      }
    })
    .catch((err) => {
      console.log("Register failed");
      console.log(err);
      if (!isInclude) {
        response.body = {
          code: 101,
          msg: "Register failed",
        };
      }
    });
});

router.post("/login", async (ctx) => {
  const { request, response } = ctx;
  // 获取对象中的用户名和密码
  let { username, password } = request.body;
  // 创建MD5对象
  let mds = crypto.createHash("md5");
  // 对密码进行加密，密码是十六进制的字符串
  let newPwd = mds.update(password).digest("hex");
  // 查询
  await userModel
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
          // jwt.sign()传入要生成token信息的对象
          let newToken = sign({ ...data[0] });
          // 将token和其他信息打包后相应给客户端
          console.log("Login success");
          response.body = {
            code: 100,
            id: data[0].id,
            msg: "Login success",
            token: newToken,
          };
        } else {
          // 密码不相同
          console.log("Login failed");
          response.body = {
            code: 101,
            msg: "Login failed, please check the username or the password",
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
