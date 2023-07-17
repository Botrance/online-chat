const msgModel = require("../model/msg");
const roomModel = require("../model/room");
const UserRoomModel = require("../model/related/UserRoom");

const { Op } = require("sequelize");
const { generateRandomId } = require("./tools");
const { secretKey } = require("./jwt.js");
const jwt = require("jsonwebtoken");

module.exports = function (server) {
  const io = require("socket.io")(server, { cors: true });

  io.use((socket, next) => {
    // 从握手数据中获取 token
    const token = socket.handshake.auth.token;

    // 进行 token 验证
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        console.log("token verification failed");
        next(new Error("token verification failed"));
      } else {
        console.log("token verification success");

        // 将验证结果添加到 socket 对象中
        socket.decodedToken = decoded;

        next();
      }
    });
  });

  io.on("connection", (socket) => {
    console.log("one client connect success");
    const { decodedToken } = socket;

    try {
      if (decodedToken) {
        socket.emit("resMsg", {
          code: 100,
          msg: "token verification success.",
        });

        // 加入房间

        socket.on("joinRoom", async ({ roomId, username, timestamp }) => {
          try {
            if (roomId) {
              // 根据 roomId 加入房间
              const room = await roomModel.findOne({ where: { roomId } });
              if (room) {
                socket.join(room.roomId);
                console.log(`User ${username} joined room ${room.roomId}`);
                socket.emit("resMsg", {
                  code: 100,
                  msg: "joinRoom success",
                });

                await UserRoomModel.update(
                  {
                    msgView: timestamp,
                  },
                  {
                    where: {
                      roomId: roomId,
                      username: username,
                    },
                  }
                );
              } else {
                console.log(`Room ${roomId} does not exist.`);
                socket.emit("resMsg", {
                  code: 110,
                  msg: `Room ${roomId} does not exist.`,
                });
              }
            } else {
              console.log("Invalid joinRoom request.");
              socket.emit("resMsg", {
                code: 110,
                msg: "Invalid joinRoom request.",
              });
            }
          } catch (error) {
            console.error(error);
            socket.emit("resMsg", { code: 101, msg: "Server error." });
          }
        });

        // 发送消息
        socket.on(
          "sendMessage",
          async ({ roomId, username, message, timestamp }) => {
            try {
              if (roomId) {
                // 创建消息记录
                await msgModel.create({
                  id: generateRandomId(),
                  roomId: roomId,
                  sender: username,
                  message: message,
                  timestamp: timestamp,
                });

                await roomModel.update(
                  {
                    msgUpdate: timestamp,
                  },
                  {
                    where: {
                      roomId: roomId,
                    },
                  }
                );

                // 在房间内广播消息
                io.to(roomId).emit("message", { updateMsg: "newMsg" });
              } else {
                console.log("Invalid sendMessage request. RoomId is missing.");
                socket.emit("resMsg", {
                  code: 110,
                  msg: "Invalid sendMessage request. RoomId is missing.",
                });
              }
            } catch (error) {
              console.error(error);
              socket.emit("resMsg", { code: 101, msg: "Server error." });
            }
          }
        );

        // 离开房间
        socket.on("leaveRoom", async ({ roomId, username }) => {
          try {
            socket.leave(roomId);
            console.log(`User ${username} left room ${roomId}`);
            socket.emit("resMsg", {
              code: 100,
              msg: "leaveRoom success.",
            });
          } catch (error) {
            console.error(error);
            socket.emit("resMsg", { code: 101, msg: "Server error." });
          }
        });
      }
    } catch (error) {
      console.error(error);
      socket.emit("resMsg", {
        code: 101,
        msg: "token verification failed.",
      });
    }
  });
};
