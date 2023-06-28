const DB = require("../config/dbconfig"); // 导入数据库配置文件

const Sequelize = require("sequelize");

const roomModel = DB.define(
  "room",
  {
    // "auth"是info数据库下的表，第一个参数是表名
    roomid: {
      // id与数据库中的列名保持一致
      type: Sequelize.STRING(127), // int类型
      primaryKey: true, // 主键
      unique: true, // 唯一的键
    },
    users: {
      type: Sequelize.JSON, // Json类型
    },
    timestamp: {
      primaryKey: true,
      type: Sequelize.DATE,
    },
  },
  {
    freezeTableName: true, // 使用自定义表名
    timestamps: false, // 使用时间戳
  }
);

module.exports = roomModel; // 导出该模块
