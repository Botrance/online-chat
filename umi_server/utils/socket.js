const authModel = require("../model/auth");
const messageModel = require("../model/message");
const roomModel = require("../model/room");

const { initTable } = require("../utils/initTable");

module.exports = function (server) {
  const io = require("socket.io")(server, { cors: true });

  io.on("connection", function (socket) {
    console.log("有一个客户端连接上了服务器");
    
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userID: id,
        username: socket.username,
      });
    }
    socket.emit("users", users);

    // socket.on("roomConnect", async function (data) {
    //   const { roomid, username, time } = data;
    //   let isInclude = false;
    //   // if (roomid) {
    //   //   await initTable("room")
    //   //   await roomModel
    //   //     .findAll({
    //   //       where: {
    //   //         roomid: roomid,
    //   //       },
    //   //     })
    //   //     .then((data) => {
    //   //       if (data && data.length) {
    //   //         isInclude = true;
    //   //       } else {
    //   //         console.log("房间不存在");
    //   //         io.emit("resCode", {
    //   //           apiName: "roomConnect",
    //   //           code: 110,
    //   //           msg: "房间不存在",
    //   //         });
    //   //       }
    //   //     })
    //   //     .catch((err) => {
    //   //       console.log("房间查找失败");
    //   //       console.log(err);
    //   //       io.emit("resCode", {
    //   //         apiName: "roomConnect",
    //   //         code: 101,
    //   //         msg: "房间查找失败",
    //   //       });
    //   //     });
    //   // }

    //   if (!isInclude) {
    //     const id = roomid ? roomid : 0;
    //   }

    //   await socket.join(roomid);
    //   socket.to(roomid).emit("resCode", {
    //     apiName: "roomConnect",
    //     data: {},
    //     code: 100,
    //     msg: "连接成功",
    //   });

    // });

    socket.on("sendMsg", async function (data) {
      console.log("服务器接收到客户端发送的消息", data);
  
      const { id = "", message = "", user_sender, user_receiver, time ,roomid } = data;
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
              apiName: "sendMsg",
              code: 110,
              msg: "用户不存在",
            });
          }
        })
        .catch((err) => {
          console.log("用户查找失败");
          console.log(err);
          io.emit("resCode", {
            apiName: "sendMsg",
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
              apiName: "sendMsg",
              code: 100,
              msg: "消息发送成功",
            });
          })
          .catch((err) => {
            console.log("消息发送失败");
            console.log(err);
            io.emit("resCode", {
              apiName: "sendMsg",
              code: 101,
              msg: "消息发送失败",
            });
          });
      }

      // socket.leave(roomid);
    });
    
    socket.on("roomLeave",async function (data){
      const { roomid, time } = data;
      socket.leave(roomid);
      socket.off("sendMsg");
    })

  });

};
