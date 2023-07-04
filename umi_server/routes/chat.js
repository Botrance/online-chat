const Router = require("koa-router");
const router = new Router(); // 使用路由模块化管理

const authModel = require("../model/auth"); // 导入数据库模型
const messageModel = require("../model/message"); // 导入数据库模型
const roomModel = require("../model/room");


router.get("/test", (ctx) => {
  ctx.type = "html";
  ctx.body = "<h1>test</h1>";
});

router.get('/getFriends', (ctx, next) => {
  // 在这里编写获取列表的逻辑
  const friends = ['Botrance', 'fushizhang'];
  ctx.body = { friends };
});

router.get('/getRooms', (ctx, next) => {
  // 在这里编写获取列表的逻辑
  const rooms = [{roomId:'123456',roomName:"123123"}];
  ctx.body = { rooms };
});

module.exports = router.routes();