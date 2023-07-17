const Router = require("koa-router");
const router = new Router(); // 使用路由模块化管理
const { Op } = require("sequelize");
const userModel = require("../../model/user"); // 导入数据库模型
const UserUserModel = require("../../model/related/UserUser"); // 导入关联表模型

router.get("/test", (ctx) => {
  ctx.type = "html";
  ctx.body = "<h1>test</h1>";
});

// 好友查询
router.post("/query", async (ctx) => {
  try {
    const { username, timestamp } = ctx.request.body;

    if (timestamp) {
      // 根据用户名和时间戳查询用户信息
      const user = await userModel.findOne({
        where: {
          username: username,
          friendUpdate: {
            [Op.gte]: timestamp,
          },
        },
      });

      if (user) {
        ctx.body = { code: 102, msg: "Friend list never changed." };
        return;
      }
    }

    // 根据用户名查询关联记录
    const userFriends = await UserUserModel.findAll({
      where: {
        majorName: username,
      },
      attributes: ["minorName"],
    });

    // 获取好友列表
    const friends = userFriends.map((userFriend) => userFriend.minorName);

    ctx.body = { code: 100, msg: "Query successful.", friends };
  } catch (error) {
    console.error(error);
    ctx.body = { code: 101, msg: "Failed to query friends." };
  }
});

// 添加好友
router.post("/add", async (ctx) => {
  try {
    const { majorName, minorName, timestamp } = ctx.request.body;

    // 更新 user 表的 friendUpdate 字段
    await userModel.update(
      { friendUpdate: timestamp },
      { where: { username: majorName } }
    );

    // 创建关联记录
    await UserUserModel.create({ majorName, minorName });

    ctx.body = { code: 100, msg: "Friend added successfully." };
  } catch (error) {
    console.error(error);
    ctx.body = { code: 101, msg: "Failed to add friend." };
  }
});

// 删除好友
router.post("/delete", async (ctx) => {
  try {
    const { majorName, minorName, timestamp } = ctx.request.body;

    // 更新 user 表的 friendUpdate 字段
    await userModel.update(
      { friendUpdate: timestamp },
      { where: { username: majorName } }
    );

    // 删除关联记录
    await UserUserModel.destroy({
      where: { majorName, minorName },
    });

    ctx.body = { code: 100, msg: "Friend deleted successfully." };
  } catch (error) {
    console.error(error);
    ctx.body = { code: 101, msg: "Failed to delete friend." };
  }
});

// 好友匹配
router.post("/match", async (ctx) => {
  try {
    const { id, username } = ctx.request.body;

    let user;

    if (id) {
      // 根据 id 匹配用户
      user = await userModel.findOne({
        where: {
          id: id,
        },
      });
    } else {
      // 根据 username 匹配用户
      user = await userModel.findOne({
        where: {
          username: username,
        },
      });
    }

    if (!user) {
      ctx.body = { code: 110, msg: "User not found." };
    } else {
      ctx.body = { code: 100, msg: "Match successful.", user };
    }
  } catch (error) {
    console.error(error);
    ctx.body = { code: 101, msg: "Failed to match user." };
  }
});

module.exports = router.routes();