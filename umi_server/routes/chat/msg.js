const Router = require("koa-router");
const router = new Router(); // 使用路由模块化管理
const { Op } = require("sequelize");
const msgModel = require("../../model/msg"); // 导入数据库模型

router.get("/test", (ctx) => {
  ctx.type = "html";
  ctx.body = "<h1>test</h1>";
});

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
    });

    // 构造结果对象数组
    const result = messages.map((msg) => ({
      id: msg.id,
      sender: msg.sender,
      message: msg.message,
      time_CN: msg.time_CN,
    }));

    ctx.body = { code: 100, msg: "Query successful.", result };
  } catch (error) {
    console.error(error);
    ctx.body = { code: 101, msg: "Failed to query messages." };
  }
});

module.exports = router.routes();