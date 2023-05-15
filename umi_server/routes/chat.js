const Router = require("koa-router");
const router = new Router(); // 使用路由模块化管理
const { sign, verify } = require("../utils/jwt"); //导入加密与验证

const { initTable } = require("../utils/initTable");
const authModel = require("../model/auth"); // 导入数据库模型
const messageModel = require("../model/message"); // 导入数据库模型

router.get("/test", (ctx) => {
  ctx.type = "html";
  ctx.body = "<h1>test</h1>";
});

router.post("/sendMsg", async (ctx) => {
  const { request, response } = ctx;
  let { id, message, user_sender, user_receiver, time } = request.body;

  let isInclude = false;

  await initTable("auth");
  await authModel
    .findAll({
      where: {
        // 查找用户名
        id: id,
        username: user_sender,
      },
    })
    .then((data) => {
      if (data && data.length) {
        isInclude = true;
      } else {
        console.log("用户不存在");
        response.body = {
          code: 110,
          msg: "用户不存在",
        };
      }
    })
    .catch((err) => {
      console.log("用户查找失败");
      console.log(err);
      response.body = {
        code: 101,
        msg: "用户查找失败",
      };
    });

  if (isInclude) {
    await initTable("message");
    await messageModel
      .create({
        id: id,
        user_sender: user_sender,
        user_receiver: user_receiver,
        message: message,
        timestamp: Date.now(),
      })
      .then((result) => {
        // 创建成功后传递的数据
        console.log("消息发送成功");
        response.body = {
          code: 100,
          msg: "消息发送成功",
        };
      })
      .catch((err) => {
        console.log("消息发送失败");
        console.log(err);
        response.body = {
          code: 101,
          msg: "消息发送失败",
        };
      });
  }
});

module.exports = router.routes();
