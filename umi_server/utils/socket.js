const messageModel = require("../model/message");
const roomModel = require("../model/room");
const UserRoomModel = require("../model/related/UserRoom");

const { Op } = require("sequelize");
const { generateRandomId } = require("./tools");

module.exports = function (server) {
  const io = require("socket.io")(server, { cors: true });

  io.on("connection", (socket) => {
    console.log("有一个客户端连接上了服务器");

    // 加入房间
    socket.on("joinRoom", async ({ roomId, username }) => {
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