const Router = require("koa-router");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser"); // 使用才能解析post数据
const cors = require("koa2-cors");

const app = new Koa();
const router = new Router();
const PORT = 3030;
const server = require("http").Server(app.callback());
const userModel = require("./model/user"); // 导入数据库模型

const Redis = require("ioredis");

// 创建 Redis 客户端实例，默认连接到本地 6379 端口
const redisClient = new Redis();

// 连接成功后的回调
redisClient.on("connect", () => {
  console.log("Connected to Redis server");
});

// 连接失败后的回调
redisClient.on("error", (err) => {
  console.error("Error connecting to Redis server:", err);
});

// 通用的 Redis 缓存函数，用于缓存 userId 和对应的 userName
async function cacheUserNames(ids) {
  console.log(ids)
  const cacheKeys = ids.map((id) => `userName:${id}`);
  const cachedUserNames = await redisClient.hmget("userNames", ...cacheKeys);

  const uncachedIds = [];
  const queryPromises = [];

  const userNameMap = {}; // 用于存储 userId 和对应的 userName

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const cachedUserName = cachedUserNames[i];

    if (cachedUserName) {
      // 如果缓存中存在 userName，则直接使用缓存结果
      userNameMap[id] = cachedUserName;
    } else {
      // 否则添加到未缓存的 ids 数组中，并创建查询 userName 的 Promise
      uncachedIds.push(id);
      queryPromises.push(
        userModel.findOne({
          where: { userId: id },
          attributes: ["userId", "userName"],
        })
      );
    }
  }

  // 批量查询未缓存的 userName
  const users = await Promise.all(queryPromises);

  // 将查询到的 userName 存储到 Redis 缓存中
  for (let i = 0; i < uncachedIds.length; i++) {
    const user = users[i];
    if (user && user.userId && user.userName) {
      await redisClient.hset("userNames", `userName:${user.userId}`, user.userName); // 存储到 Redis 的 Hash 表中
      // 将 userName 添加到 userNameMap 中
      userNameMap[user.userId] = user.userName;
    }
  }

  return userNameMap; // 返回 userId 和对应的 userName 的映射
}

app.context.cacheUserNames = cacheUserNames;

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
app.on("close", () => {
  redisClient.quit();
});