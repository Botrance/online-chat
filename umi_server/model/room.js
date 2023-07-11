const DB = require("../config/dbconfig"); // 导入数据库配置文件
const { DataTypes } = require("sequelize");
const Sequelize = require("sequelize");

const roomModel = DB.define(
  "room",
  {
    roomId: {
      type: Sequelize.STRING(64),
      primaryKey: true, // 主键
      unique: true, // 唯一的键
      allowNull: false,
    },
    roomName: {
      type: Sequelize.STRING(64),
      allowNull: false,
    },
    roomType: {
      type: Sequelize.STRING(32),
      allowNull: false, //private,public
    },
    msgUpdate: { type: DataTypes.BIGINT, allowNull: true },
  },
  {
    freezeTableName: true, // 使用自定义表名
    timestamps: false, // 不使用时间戳
  }
);

module.exports = roomModel; // 导出该模块
