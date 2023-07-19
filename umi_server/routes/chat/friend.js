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
    if (userFriends.length > 0)
      ctx.body = { code: 100, msg: "Query successful.", friends: userFriends };
    else ctx.body = { code: 110, msg: "No friends found for the user." };
  } catch (error) {
    console.error(error);
    ctx.body = { code: 101, msg: "Failed to query friends." };
  }
});

// 添加好友
router.post("/add", async (ctx) => {
  try {
    const { majorName, minorName, timestamp } = ctx.request.body;

    // 使用事务保证原子操作
    await DB.transaction(async (transaction) => {
      // 更新 user 表的 friendUpdate 字段
      await userModel.update(
        { friendUpdate: timestamp ? timestamp : Date.now() },
        {
          where: { username: { [Op.in]: [majorName, minorName] } },
          transaction,
        }
      );

      // 创建关联记录
      await UserUserModel.create({ majorName, minorName }, { transaction });
      await UserUserModel.create(
        { majorName: minorName, minorName: majorName },
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
    const { majorName, minorName, timestamp } = ctx.request.body;

    // 使用事务保证原子操作
    await DB.transaction(async (transaction) => {
      // 更新 user 表的 friendUpdate 字段
      await userModel.update(
        { friendUpdate: timestamp ? timestamp : Date.now() },
        {
          where: { username: { [Op.in]: [majorName, minorName] } },
          transaction,
        }
      );

      // 删除关联记录
      await UserUserModel.destroy({
        where: {
          [Op.or]: [
            { majorName, minorName },
            { majorName: minorName, minorName: majorName },
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
      // 如果 matchStr 是一个合法的数字，认为是根据 id 进行匹配
      user = await userModel.findAll({
        where: {
          id: parseInt(matchStr),
        },
        attributes: ["id", "username"],
      });
    } else {
      // 否则认为是根据 username 进行匹配
      user = await userModel.findAll({
        where: {
          username: matchStr,
        },
        attributes: ["id", "username"],
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
