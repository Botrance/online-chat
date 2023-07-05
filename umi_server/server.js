const Router = require("koa-router");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser"); // 使用才能解析post数据
const cors = require("koa2-cors");

const app = new Koa();
const router = new Router();
const PORT = 3030;
const server = require("http").Server(app.callback());

const { initialize, syncModels } = require("./utils/initTable");

require("./utils/socket")(server);
const { verify } = require("./utils/jwt");

app.use(bodyParser()).use(
  cors({
    origin: "*",
    maxAge: 2592000,
    credentials: true,
  })
);

(async function () {
  try {
    // 初始化表和定义关联关系
    await initialize();

    // 同步所有模型到数据库
    await syncModels();

    // 创建服务器并监听端口
    server.listen(PORT, () => {
      console.log("listen on " + PORT + " ...");
    });
  } catch (error) {
    console.error("Server initialization error:", error);
  }
})();

// 验证 token 的中间件
const verifyTokenMiddleware = async (ctx, next) => {
  try {
    await verify(ctx.request, ctx.response);
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { code: 101, msg: "Token verification failed." };
  }
};

const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
router.use("/api/user", userRouter);
router.use("/api/chat", chatRouter);
// router.use("/chat", verifyTokenMiddleware);
app.use(router.routes()).use(router.allowedMethods());
