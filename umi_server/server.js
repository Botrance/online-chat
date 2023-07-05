const Router = require("koa-router");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser"); //使用才能解析post数据
const cors = require("koa2-cors");

const app = new Koa();
const router = new Router();
const PORT = 3030;
const server = require("http").Server(app.callback());

const { initTable } = require("./utils/initTable");

require("./utils/socket")(server);

app.use(bodyParser()).use(
  cors({
    origin: "*",
    maxAge: 2592000,
    credentials: true,
  })
);

initTable("user");
initTable('room');
initTable('message');
initTable('UserRoom');

const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
router.use("/user", userRouter);
router.use("/chat", chatRouter);
app.use(router.routes()).use(router.allowedMethods());

server.listen(PORT, () => {
  console.log("listen on " + PORT + " ...");
});
