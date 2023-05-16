const Router = require("koa-router");
const router = new Router(); // 使用路由模块化管理
const { sign, verify } = require("../utils/jwt"); //导入加密与验证

const { initTable } = require("../utils/initTable");
const authModel = require("../model/auth"); // 导入数据库模型
const messageModel = require("../model/message"); // 导入数据库模型

router.get("/test", (ctx) => {
  ctx.type = "html";
  ctx.body = "<h1>test</h1>";
});

module.exports = router.routes();