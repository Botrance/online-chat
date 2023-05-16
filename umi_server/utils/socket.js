const authModel = require("../model/auth"); // 导入数据库模型
const messageModel = require("../model/message"); // 导入数据库模型
const { initTable } = require("../utils/initTable");

module.exports = function (server) {
  const io = require("socket.io")(server, { cors: true });

  // 监视客户端与服务器的连接
  io.on("connection", function (socket) {
    console.log("有一个客户端连接上了服务器");
    socket.on("roomConnect", function (data) {
      
    });
    // 绑定监听, 接收客户端发送的消息
    socket.on("sendMsg", async function (data) {
      console.log("服务器接收到客户端发送的消息", data);

      let { id = "", message = "", user_sender, user_receiver, time } = data;
      let isInclude = false;

      await initTable("auth");
      await authModel
        .findAll({
          where: {
            // 查找用户名
            id: id,
            username: user_sender,
          },
        })
        .then((data) => {
          if (data && data.length) {
            isInclude = true;
          } else {
            console.log("用户不存在");

            io.emit("resCode", {
              code: 110,
              msg: "用户不存在",
            });
          }
        })
        .catch((err) => {
          console.log("用户查找失败");
          console.log(err);
          io.emit("resCode", {
            code: 101,
            msg: "用户查找失败",
          });
        });

      if (isInclude) {
        await initTable("message");
        await messageModel
          .create({
            id: id,
            user_sender: user_sender,
            user_receiver: user_receiver,
            message: message,
            timestamp: time,
          })
          .then((result) => {
            // 创建成功后传递的数据
            console.log("消息发送成功");
            io.emit("resCode", {
              code: 100,
              msg: "消息发送成功",
            });
          })
          .catch((err) => {
            console.log("消息发送失败");
            console.log(err);
            io.emit("resCode", {
              code: 101,
              msg: "消息发送失败",
            });
          });
      }
    });
  });
};
