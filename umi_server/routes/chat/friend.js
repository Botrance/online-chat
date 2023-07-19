const Router = require("koa-router");
const router = new Router(); // 使用路由模块化管理
const { Op } = require("sequelize");
const userModel = require("../../model/user"); // 导入数据库模型
const UserUserModel = require("../../model/related/UserUser"); // 导入关联表模型
const DB = require("../../config/dbconfig"); // 导入数据库配置文件

router.get("/test", (ctx) => {
  ctx.type = "html";
  ctx.body = "<h1>test</h1>";
});

// 好友查询
router.post("/query", async (ctx) => {
  try {
    const { userId, timestamp } = ctx.request.body;

    if (timestamp) {
      // 根据 userId 和时间戳查询用户信息
      const user = await userModel.findOne({
        where: {
          userId: userId,
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

    // 根据 userId 查询关联记录
    const userFriends = await UserUserModel.findAll({
      where: {
        majorId: userId,
      },
      attributes: ["minorId"],
    });

    // 获取好友的用户名
    const friendIds = userFriends.map((userFriend) => userFriend.minorId);
    const friends = await userModel.findAll({
      where: {
        userId: friendIds,
      },
      attributes: ["userId", "userName"], // 指定要查询的字段
    });

    if (friends.length > 0) {
      ctx.body = { code: 100, msg: "Query successful.", friends: friends };
    } else {
      ctx.body = { code: 110, msg: "No friends found for the user." };
    }
  } catch (error) {
    console.error(error);
    ctx.body = { code: 101, msg: "Failed to query friends." };
  }
});
// 添加好友
router.post("/add", async (ctx) => {
  try {
    const { majorId, minorId, timestamp } = ctx.request.body;

    // 使用事务保证原子操作
    await DB.transaction(async (transaction) => {
      // 更新 user 表的 friendUpdate 字段
      await userModel.update(
        { friendUpdate: timestamp ? timestamp : Date.now() },
        {
          where: { userId: { [Op.in]: [majorId, minorId] } },
          transaction,
        }
      );

      // 创建关联记录
      await UserUserModel.create({ majorId, minorId }, { transaction });
      await UserUserModel.create(
        { majorId: minorId, minorId: majorId },
        { transaction }
      );
    });

    ctx.body = { code: 100, msg: "Friend added successfully." };
  } catch (error) {
    console.error(error);
    ctx.body = { code: 101, msg: "Failed to add friend." };
  }
});

// 删除好友
router.post("/delete", async (ctx) => {
  try {
    const { majorId, minorId, timestamp } = ctx.request.body;

    // 使用事务保证原子操作
    await DB.transaction(async (transaction) => {
      // 更新 user 表的 friendUpdate 字段
      await userModel.update(
        { friendUpdate: timestamp ? timestamp : Date.now() },
        {
          where: { userId: { [Op.in]: [majorId, minorId] } },
          transaction,
        }
      );

      // 删除关联记录
      await UserUserModel.destroy({
        where: {
          [Op.or]: [
            { majorId, minorId },
            { majorId: minorId, minorId: majorId },
          ],
        },
        transaction,
      });
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
    const { matchStr } = ctx.request.body;

    let user;

    if (!isNaN(matchStr)) {
      // 如果 matchStr 是一个合法的数字，认为是根据 userId 进行匹配
      user = await userModel.findAll({
        where: {
          userId: parseInt(matchStr),
        },
        attributes: ["userId", "userName"],
      });
    } else {
      // 否则认为是根据 userName 进行匹配
      user = await userModel.findAll({
        where: {
          userName: matchStr,
        },
        attributes: ["userId", "userName"],
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
