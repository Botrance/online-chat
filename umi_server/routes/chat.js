const Router = require("koa-router");
const router = new Router(); // 使用路由模块化管理

router.get("/test", (ctx) => {
  ctx.type = "html";
  ctx.body = "<h1>test</h1>";
});

const msgRouter = require("./chat/msg");
const roomRouter = require("./chat/room");
const friendRouter = require("./chat/friend");
router.use("/msg", msgRouter);
router.use("/room", roomRouter);
router.use("/friend", friendRouter);

module.exports = router.routes();
