const DB = require("../config/dbconfig"); // 导入数据库配置文件

const Sequelize = require("sequelize");

const authModel = DB.define("auth", { // "auth"是info数据库下的表，第一个参数是表名
    id: { // id与数据库中的列名保持一致
        type: Sequelize.INTEGER, // int类型
        primaryKey: true, // 主键
        autoIncrement: true, // 自动增长
        unique: true // 唯一的键
    },
    username: { // username与数据库中的列名保持一致
        type: Sequelize.STRING(30), // string类型
        allowNull: false // 不允许为空
    },
    password: { // password与数据库中列名保持一致
        type: Sequelize.STRING(255), // string类型
        allowNull: false // 不允许为空
    }
}, {
    freezeTableName: true, // 使用自定义表名
    timestamps: false // 不使用时间戳
})

module.exports = authModel; // 导出该模块
