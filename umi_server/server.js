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

const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
router.use("/user", userRouter);
router.use("/chat", chatRouter);
app.use(router.routes()).use(router.allowedMethods());