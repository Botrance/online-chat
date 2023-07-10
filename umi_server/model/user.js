const DB = require("../config/dbconfig"); // 导入数据库配置文件

const { DataTypes } = require("sequelize");

const userModel = DB.define(
  "user",
  {
    // "user"是info数据库下的表，第一个参数是表名
    id: {
      type: DataTypes.STRING(64),
      primaryKey: true, // 主键
      unique: true, // 唯一的键
    },
    username: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    roomUpdate: { type: DataTypes.BIGINT, allowNull: true },
    friendUpdate: { type: DataTypes.BIGINT, allowNull: true },
  },
  {
    freezeTableName: true, // 使用自定义表名
    timestamps: true, // 使用时间戳
  }
);

module.exports = userModel; // 导出该模块
