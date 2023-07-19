var Sequelize = require("sequelize");
const DB = new Sequelize("info", "root", "asd123456", {
    host: "localhost", // 主机地址
    port: 3306, // 数据库端口号
    dialect: "mysql", // 数据库类型
    pool: { // 数据库连接池
        max: 5, // 最大连接数量
        min: 0, // 最小连接数量
        idle: 10000, // 如果10秒内没有被使用，释放该线程
        acquire:60000
    },
    timezone: '+08:00'
})

// const DB = new Sequelize("info", "testuser", "yjw@021026", {
//     host: "rm-cn-nwy3awpqa0007zo.rwlb.rds.aliyuncs.com", // 主机地址
//     port: 3306, // 数据库端口号
//     dialect: "mysql", // 数据库类型
//     pool: { // 数据库连接池
//         max: 5, // 最大连接数量
//         min: 0, // 最小连接数量
//         idle: 10000, // 如果10秒内没有被使用，释放该线程
//         acquire:60000
//     },
//     timezone: '+08:00'
// })
module.exports = DB;
 