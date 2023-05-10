var Sequelize = require("sequelize");
// 参数分别是：数据库名、用户名、密码
const DB = new Sequelize("info", "root", "asd123456", {
    host: "localhost", // 主机地址
    port: 3306, // 数据库端口号
    dialect: "mysql", // 数据库类型
    pool: { // 数据库连接池
        max: 5, // 最大连接数量
        min: 0, // 最小连接数量
        idle: 10000, // 如果10秒内没有被使用，释放该线程
        acquire:60000
    }
})
module.exports = DB;
 