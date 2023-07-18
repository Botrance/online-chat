const DB = require("../config/dbconfig"); // 导入数据库配置文件
const { DataTypes } = require("sequelize");

const roomModel = DB.define(
  "room",
  {
    roomId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true, // 主键
      unique: true, // 唯一的键
      allowNull: false,
    },
    roomName: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    roomType: {
      type: DataTypes.STRING(32),
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
