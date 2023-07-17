const Router = require("koa-router");
const router = new Router(); // 使用路由模块化管理

const { Op } = require("sequelize");
const { generateRandomId } = require("../utils/tools");

const userModel = require("../model/user"); // 导入数据库模型
const msgModel = require("../model/msg"); // 导入数据库模型
const roomModel = require("../model/room"); // 导入数据库模型
const UserRoomModel = require("../model/related/UserRoom"); // 导入关联表模型
const UserUserModel = require("../model/related/UserUser"); // 导入关联表模型

router.get("/test", (ctx) => {
  ctx.type = "html";
  ctx.body = "<h1>test</h1>";
});

// 查询房间列表
router.post("/room/query", async (ctx) => {
  try {
    const { username, timestamp, roomType } = ctx.request.body;

    // 查询用户的 roomUpdate 值
    const user = await userModel.findOne({
      where: {
        username: username,
      },
    });

    // timestamp为空表示全量查询，user的room从未update也全量，update小于timestamp则不返回
    if (
      user &&
      (!user.roomUpdate || !timestamp || user.roomUpdate >= timestamp)
    ) {
      let roomQuery = {
        username: username,
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

      if (userRooms.length === 0) {
        ctx.body = { code: 110, msg: "No rooms found for the user." };
      } else {
        const rooms = userRooms.map((userRoom) => {
          const { roomId, roomName, roomType } = userRoom.room;
          return { roomId, roomName, roomType };
        });

        ctx.body = { code: 100, msg: "Query successful.", rooms };
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
router.post("/room/create", async (ctx) => {
  const { roomId, roomName, roomType } = ctx.request.body;
  const maxAttempts = 10; // 最大尝试次数
  let newRoomId = roomId;
  let attempts = 0;

  if (!newRoomId) {
    newRoomId = generateRandomId();
  }

  try {
    while (attempts < maxAttempts) {
      const existingRoom = await roomModel.findOne({
        where: {
          roomId: newRoomId,
        },
      });

      if (!existingRoom) {
        break;
      }

      newRoomId = generateRandomId();
      attempts++;
    }

    if (attempts === maxAttempts) {
      ctx.body = { code: 101, msg: "Failed to create room." };
      throw new Error("Failed to generate a unique roomId.");
    }

    // 创建房间记录
    const room = await roomModel.create({
      roomId: newRoomId,
      roomName: roomName,
      roomType: roomType ? roomType : "public",
    });

    ctx.body = { code: 100, msg: "Room created successfully.", room };
  } catch (error) {
    console.error(error);
    ctx.body = { code: 101, msg: "Failed to create room." };
  }
});

// 删除房间
router.post("/room/delete", async (ctx) => {
  const { roomId } = ctx.request.body;

  try {
    // 查询要删除的房间是否存在
    const room = await roomModel.findOne({
      where: {
        roomId: roomId,
      },
    });

    if (!room) {
      ctx.body = { code: 110, msg: "Room not found." };
      return;
    }

    // 删除房间记录
    const deletedCount = await roomModel.destroy({
      where: {
        roomId: roomId,
      },
    });

    if (deletedCount > 0) {
      // 获取与要删除的房间相关的所有 UserRoom 记录
      const userRooms = await UserRoomModel.findAll({
        where: {
          roomId: roomId,
        },
      });

      // 获取相关用户的用户名
      const usernames = userRooms.map((userRoom) => userRoom.username);

      // 更新这些用户的 roomUpdate 字段
      const currentTimeStamp = Date.now();
      await userModel.update(
        { roomUpdate: currentTimeStamp },
        {
          where: {
            username: usernames,
          },
        }
      );

      ctx.body = { code: 100, msg: "Room deleted successfully.", deletedCount };
    } else {
      ctx.body = { code: 110, msg: "No room found for deletion." };
    }
  } catch (error) {
    console.error(error);
    ctx.body = { code: 101, msg: "Failed to delete room." };
  }
});

// 加入房间
router.post("/room/join", async (ctx) => {
  const { username, roomId } = ctx.request.body;

  try {
    // 查询用户是否存在
    const user = await userModel.findOne({
      where: {
        username: username,
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
          username: username,
        },
      });

      if (existingUserRoom) {
        ctx.body = { code: 110, msg: "User has already joined the room." };
        return;
      }

      // 创建关联记录
      await UserRoomModel.create({
        roomId: room.roomId,
        username: username,
      });

      // 更新用户记录的 roomUpdate 字段
      const currentTimeStamp = Date.now();
      await userModel.update(
        { roomUpdate: currentTimeStamp },
        {
          where: {
            username: username,
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
router.post("/room/leave", async (ctx) => {
  const { username, roomId } = ctx.request.body;

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
          username: username,
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

router.post("/friend/query", async (ctx) => {
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

router.post("/friend/add", async (ctx) => {
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

router.post("/friend/delete", async (ctx) => {
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

router.post("/msg/query", async (ctx) => {
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
