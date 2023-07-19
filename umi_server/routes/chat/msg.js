const Router = require("koa-router");
const router = new Router(); // 使用路由模块化管理
const { Op } = require("sequelize");
const msgModel = require("../../model/msg"); // 导入数据库模型

router.get("/test", (ctx) => {
  ctx.type = "html";
  ctx.body = "<h1>test</h1>";
});

// 查询消息
router.post("/query", async (ctx) => {
  try {
    const { startTime, endTime, roomId } = ctx.request.body;

    const query = {
      roomId: roomId,
      timestamp: {
        [Op.gte]: startTime,
      },
    };

    if (endTime) {
      query.timestamp[Op.lte] = endTime;
    }

    // 查询数据表中满足条件的消息
    const messages = await msgModel.findAll({
      where: query,
      order: [["timestamp", "ASC"]],
      attributes: ["id", "sender", "message", "time_CN"],
    });

    if (messages.length > 0) {
      // 获取发送者的用户ID数组
      const senderIds = messages.map((message) => message.sender);

      // 调用缓存函数，获取 userId 和对应的 userName 的映射
      const userNameMap = await ctx.cacheUserNames(senderIds);

      // 将查询到的 userName 添加到返回结果中
      const messagesWithUserName = messages.map((message) => ({
        id: message.id,
        sender: userNameMap[message.sender],
        message: message.message,
        time_CN: message.time_CN,
      }));

      ctx.body = {
        code: 100,
        msg: "Query successful.",
        result: messagesWithUserName,
      };
    }else{
      ctx.body = { code: 110, msg: "No message in the room" };
    }
  } catch (error) {
    console.error(error);
    ctx.body = { code: 101, msg: "Failed to query messages." };
  }
});

module.exports = router.routes();
