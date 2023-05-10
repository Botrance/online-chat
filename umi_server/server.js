const Router = require("koa-router");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");//使用才能解析post数据
const cors = require('koa2-cors');

const app = new Koa();
const router = new Router();
const PORT = 3030;

app.use(bodyParser()).use(cors({
  origin:"*",
  maxAge: 2592000,
  credentials: true}
));

const adminRouter = require('./routes/admin');
adminRouter(app);

app.use(router.routes()).use(router.allowedMethods())

app.listen(PORT, () => {
  console.log("listen on " + PORT + " ...");
});
