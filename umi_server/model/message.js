const DB = require("../config/dbconfig"); // 导入数据库配置文件

const Sequelize = require("sequelize");
const messageModel = DB.define(
  "message",
  {
    // "message"是info数据库下的表，第一个参数是表名

    id: {
      type: Sequelize.STRING(127), // string类型
      primaryKey: true,
      allowNull: false,
    },
    user_sender: {
      type: Sequelize.STRING(30), // string类型
      allowNull: false,
    },
    user_receiver: {
      type: Sequelize.STRING(30), // string类型
      allowNull: false,
    },
    message: {
      type: Sequelize.STRING(1023),
      allowNull: false,
    },
    timestamp: {
      primaryKey: true,
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    freezeTableName: true, // 使用自定义表名
    timestamps: false, // 使用时间戳
  }
);

module.exports = messageModel; // 导出该模块
