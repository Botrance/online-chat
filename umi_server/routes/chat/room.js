const Router = require("koa-router");
const router = new Router(); // 使用路由模块化管理
const userModel = require("../../model/user"); // 导入数据库模型
const roomModel = require("../../model/room"); // 导入数据库模型
const UserRoomModel = require("../../model/related/UserRoom"); // 导入关联表模型
const DB = require("../../config/dbconfig"); // 导入数据库配置文件

router.get("/test", (ctx) => {
  ctx.type = "html";
  ctx.body = "<h1>test</h1>";
});

// 查询房间列表
router.post("/query", async (ctx) => {
  try {
    const { userId, timestamp, roomType } = ctx.request.body;

    // 查询用户的 roomUpdate 值
    const user = await userModel.findOne({
      where: {
        userId: userId,
      },
    });

    // timestamp为空表示全量查询，user的room从未update也全量，update小于timestamp则不返回
    if (user && (!timestamp || user.roomUpdate >= timestamp)) {
      let roomQuery = {
        userId: userId,
      };

      if (roomType === "private") {
        roomQuery.roomType = "private";
      } else if (roomType === "public") {
        roomQuery.roomType = "public";
      }

      // 根据查询条件查询房间列表
      const userRooms = await UserRoomModel.findAll({
        where: roomQuery,
        include: [
          {
            model: roomModel,
            attributes: ["roomId", "roomName", "roomType"],
          },
        ],
      });

      const rooms = userRooms.map((userRoom) => {
        const { roomId, roomName, roomType } = userRoom.room;
        return { roomId, roomName, roomType };
      });

      if (userRooms.length === 0) {
        ctx.body = { code: 110, msg: "No rooms found for the user." };
      } else {
        ctx.body = { code: 100, msg: "Query successful.", rooms: rooms };
      }
    } else {
      ctx.body = { code: 102, msg: "Room never changed" };
    }
  } catch (error) {
    console.error(error);
    ctx.body = { code: 101, msg: "Failed to query rooms." };
  }
});

// 创建房间
router.post("/create", async (ctx) => {
  const { roomName, roomType, timestamp, majorId } = ctx.request.body;
  // 创建一个事务
  const transaction = await DB.transaction();
  try {
    // 查找最后一个房间记录，以便确定下一个 roomId
    const lastRoom = await roomModel.findOne({
      order: [["roomId", "DESC"]],
      transaction,
    });

    const newRoomId = lastRoom ? lastRoom.roomId + 1 : 10000;

    // 创建房间记录
    const room = await roomModel.create(
      {
        roomId: newRoomId,
        roomName: roomName,
        roomType: roomType ? roomType : "public",
        msgUpdate: timestamp ? timestamp : Date.now(),
        majorId,
      },
      { transaction }
    );

    // 创建关联记录
    await UserRoomModel.create({
      roomId: room.roomId,
      userId: majorId,
    });

    // 更新用户记录的 roomUpdate 字段
    const currentTimeStamp = Date.now();
    await userModel.update(
      { roomUpdate: currentTimeStamp },
      {
        where: {
          userId: majorId,
        },
      },
      { transaction }
    );

    // 提交事务
    await transaction.commit();

    ctx.body = { code: 100, msg: "Room created successfully.", room };
  } catch (error) {
    // 发生错误时回滚事务
    await transaction.rollback();
    console.error(error);
    ctx.body = { code: 101, msg: "Failed to create room." };
  }
});

// 删除房间
router.post("/delete", async (ctx) => {
  const { roomId } = ctx.request.body;
  // 创建一个事务
  const transaction = await DB.transaction();
  try {
    // 查询要删除的房间是否存在
    const room = await roomModel.findOne({
      where: {
        roomId: roomId,
      },
      transaction,
    });

    if (!room) {
      ctx.body = { code: 110, msg: "Room not found." };
      await transaction.rollback();
      return;
    }

    // 删除房间记录
    const deletedCount = await roomModel.destroy({
      where: {
        roomId: roomId,
      },
      transaction,
    });

    if (deletedCount > 0) {
      // 获取与要删除的房间相关的所有 UserRoom 记录
      const userRooms = await UserRoomModel.findAll({
        where: {
          roomId: roomId,
        },
        transaction,
      });

      // 获取相关用户的Id
      const userNames = userRooms.map((userRoom) => userRoom.userId);

      // 更新这些用户的 roomUpdate 字段
      const currentTimeStamp = Date.now();
      await userModel.update(
        { roomUpdate: currentTimeStamp },
        {
          where: {
            userId: userNames,
          },
          transaction,
        }
      );

      // 提交事务
      await transaction.commit();

      ctx.body = { code: 100, msg: "Room deleted successfully.", deletedCount };
    } else {
      ctx.body = { code: 110, msg: "No room found for deletion." };
    }
  } catch (error) {
    // 发生错误时回滚事务
    await transaction.rollback();
    console.error(error);
    ctx.body = { code: 101, msg: "Failed to delete room." };
  }
});

// 加入房间
router.post("/join", async (ctx) => {
  const { userId, roomId } = ctx.request.body;

  try {
    // 查询用户是否存在
    const user = await userModel.findOne({
      where: {
        userId: userId,
      },
    });

    if (!user) {
      ctx.body = { code: 110, msg: "User not found." };
      return;
    }

    const room = await roomModel.findOne({
      where: {
        roomId: roomId || "",
      },
    });

    if (room) {
      // 检查用户是否已经加入了该房间
      const existingUserRoom = await UserRoomModel.findOne({
        where: {
          roomId: room.roomId,
          userId: userId,
        },
      });

      if (existingUserRoom) {
        ctx.body = { code: 110, msg: "User has already joined the room." };
        return;
      }

      // 创建关联记录
      await UserRoomModel.create({
        roomId: room.roomId,
        userId: userId,
      });

      // 更新用户记录的 roomUpdate 字段
      const currentTimeStamp = Date.now();
      await userModel.update(
        { roomUpdate: currentTimeStamp },
        {
          where: {
            userId: userId,
          },
        }
      );

      ctx.body = { code: 100, msg: "Joined room successfully.", room };
    } else {
      ctx.body = { code: 110, msg: "Room not found." };
    }
  } catch (error) {
    console.error(error);
    ctx.body = { code: 101, msg: "Failed to join room." };
  }
});

// 离开房间
router.post("/leave", async (ctx) => {
  const { userId, roomId } = ctx.request.body;

  try {
    const room = await roomModel.findOne({
      where: {
        roomId: roomId || "",
      },
    });

    if (room) {
      // 查询关联记录
      const userRoom = await UserRoomModel.findOne({
        where: {
          roomId: room.roomId,
          userId: userId,
        },
      });

      if (userRoom) {
        // 删除关联记录
        await userRoom.destroy();

        ctx.body = { code: 100, msg: "Left room successfully.", room };
      } else {
        ctx.body = { code: 110, msg: "User is not in the room." };
      }
    } else {
      ctx.body = { code: 110, msg: "Room not found." };
    }
  } catch (error) {
    console.error(error);
    ctx.body = { code: 101, msg: "Failed to leave room." };
  }
});

// 房间匹配
router.post("/match", async (ctx) => {
  try {
    const { matchStr } = ctx.request.body;

    let room;

    if (!isNaN(matchStr)) {
      // 如果 matchStr 是一个合法的数字，认为是根据 userId 进行匹配
      room = await userModel.findAll({
        where: {
          userId: parseInt(matchStr),
        },
        attributes: ["userId", "userName"],
      });
    } else {
      // 否则认为是根据 userName 进行匹配
      room = await userModel.findAll({
        where: {
          userName: matchStr,
        },
        attributes: ["userId", "userName"],
      });
    }

    if (!room) {
      ctx.body = { code: 110, msg: "Room not found." };
    } else {
      ctx.body = { code: 100, msg: "Match successful.", room };
    }
  } catch (error) {
    console.error(error);
    ctx.body = { code: 101, msg: "Failed to match room." };
  }
});

module.exports = router.routes();
