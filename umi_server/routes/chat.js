const Router = require("koa-router");
const router = new Router(); // 使用路由模块化管理

const { Op } = require("sequelize");
const { generateRandomId } = require("../utils/tools");

const userModel = require("../model/user"); // 导入数据库模型
const msgModel = require("../model/msg"); // 导入数据库模型
const roomModel = require("../model/room"); // 导入数据库模型
const UserRoomModel = require("../model/related/UserRoom"); // 导入关联表模型

router.get("/test", (ctx) => {
  ctx.type = "html";
  ctx.body = "<h1>test</h1>";
});

// 查询房间列表
router.post("/room/query", async (ctx) => {
  try {
    console.log(ctx)
    const { username } = ctx.request.body;

    // 根据用户名查询房间列表
    const userRooms = await UserRoomModel.findAll({
      where: {
        username: username,
      },
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
      roomName,
      roomType,
    });

    ctx.body = { code: 100, msg: "Room created successfully.", room };
  } catch (error) {
    console.error(error);
    ctx.body = { code: 101, msg: "Failed to create room." };
  }
});

// 删除房间
router.post("/room/delete", async (ctx) => {
  const { roomId, roomName } = ctx.request.body;
  const whereCondition = {};

  if (roomId) {
    whereCondition.roomId = roomId;
  }

  if (roomName) {
    whereCondition.roomName = roomName;
  }

  try {
    // 删除符合条件的房间记录
    const deletedCount = await roomModel.destroy({
      where: whereCondition,
    });

    ctx.body = { code: 100, msg: "Room deleted successfully.", deletedCount };
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
      // 创建关联记录
      await UserRoomModel.create({
        roomId: room.roomId,
        username: username,
      });

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
  // 在这里编写获取列表的逻辑
  const friends = ["Botrance", "fushizhang"];
  ctx.body = { friends };
});

router.post("/msg/query", async (ctx) => {
  const { timestamp, roomId } = ctx.request.body;

  // 查询数据表中 timestamp 对应时间以前的消息
  const messages = await msgModel.findAll({
    where: {
      timestamp: {
        [Op.lte]: timestamp,
      },
      roomId: roomId,
    },
  });

  // 构造结果对象数组
  const result = messages.map((msg) => ({
    sender: msg.sender,
    message: msg.message,
    time_CN: msg.time_CN,
  }));

  ctx.body = result;
});

module.exports = router.routes();
