const crypto = require("crypto");
const messageModel = require("../model/message");
const roomModel = require("../model/room");
const UserRoomModel = require("../model/related/UserRoom");

const { Op } = require("sequelize");

// 生成 32 位随机字符串作为 roomId
function generateRandomId() {
  const randomBytes = crypto.randomBytes(16);
  const roomId = randomBytes.toString("hex");
  return roomId;
}

module.exports = function (server) {
  const io = require("socket.io")(server, { cors: true });

  io.on("connection", (socket) => {
    console.log("有一个客户端连接上了服务器");

    // 加入房间
    socket.on("joinRoom", async ({ roomId, username, othername }) => {
      try {
        if (roomId) {
          // 根据 roomId 加入房间
          const room = await roomModel.findOne({ where: { roomId } });
          if (room) {
            socket.join(room.roomId);
            console.log(`User ${username} joined room ${room.roomId}`);
            socket.emit("resMsg", {
              success: true,
              message: "joinRoom success",
            });
          } else {
            console.log(`Room ${roomId} does not exist.`);
            socket.emit("resMsg", {
              success: false,
              message: `Room ${roomId} does not exist.`,
            });
          }
        } else if (othername) {
          // 查询符合条件的房间
          const room = await roomModel.findOne({
            where: {
              roomType: "private",
            },
            include: [
              {
                model: UserRoomModel,
                where: {
                  username: {
                    [Op.in]: [username, othername],
                  },
                },
                attributes: [],
              },
            ],
          });

          if (room) {
            socket.join(room.roomId);
            console.log(
              `User ${username} joined private chat room ${room.roomId}`
            );
            socket.emit("resMsg", {
              success: true,
              message: "joinRoom success",
            });
          } else {
            // 创建新房间
            const newRoom = await roomModel.create({
              roomId: generateRandomId(),
              roomName: `${username} & ${othername}`,
              roomType: "private",
            });

            // 创建关联记录
            await UserRoomModel.create({
              roomId: newRoom.roomId,
              username: username,
            });
            await UserRoomModel.create({
              roomId: newRoom.roomId,
              username: othername,
            });

            socket.join(newRoom.roomId);
            console.log(
              `New private chat room ${newRoom.roomId} created and joined by ${username}`
            );
            socket.emit("resMsg", {
              success: true,
              roomId: newRoom.roomId,
              message: "createRoom and joinRoom success",
            });
          }
        } else {
          console.log("Invalid joinRoom request.");
          socket.emit("resMsg", {
            success: false,
            message: "Invalid joinRoom request.",
          });
        }
      } catch (error) {
        console.error(error);
        socket.emit("resMsg", { success: false, message: "Server error." });
      }
    });

    // 发送消息
    socket.on("sendMessage", async ({ roomId, username, message }) => {
      try {
        if (roomId) {
          // 创建消息记录
          const newMessage = await messageModel.create({
            id: generateRandomId(),
            roomId: roomId,
            sender: username,
            message: message,
            timestamp: new Date().getTime(),
          });

          // 在房间内广播消息
          io.to(roomId).emit("message", { updateMsg: "newMsg" });
        } else {
          console.log("Invalid sendMessage request. RoomId is missing.");
          socket.emit("resMsg", {
            success: false,
            message: "Invalid sendMessage request. RoomId is missing.",
          });
        }
      } catch (error) {
        console.error(error);
        socket.emit("resMsg", { success: false, message: "Server error." });
      }
    });

    // 离开房间
    socket.on("leaveRoom", async ({ roomId, username }) => {
      try {
        // 删除关联记录
        await UserRoomModel.destroy({
          where: {
            roomId: roomId,
            username: username,
          },
        });

        socket.leave(roomId);
        console.log(`User ${username} left room ${roomId}`);
        socket.emit("resMsg", { success: true, message: "leaveRoom success." });
      } catch (error) {
        console.error(error);
        socket.emit("resMsg", { success: false, message: "Server error." });
      }
    });
  });
};
