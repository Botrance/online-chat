const DB = require("../config/dbconfig"); // 导入数据库配置文件

const { DataTypes } = require("sequelize");

const userModel = DB.define(
  "user",
  {
    // "user"是info数据库下的表，第一个参数是表名
    id: {
      // id与数据库中的列名保持一致
      type: DataTypes.STRING(64), // int类型
      primaryKey: true, // 主键
      unique: true, // 唯一的键
    },
    username: {
      // username与数据库中的列名保持一致
      type: DataTypes.STRING(64), // string类型
      allowNull: false, // 不允许为空
    },
    password: {
      // password与数据库中列名保持一致
      type: DataTypes.STRING(64), // string类型
      allowNull: false, // 不允许为空
    },
  },
  {
    freezeTableName: true, // 使用自定义表名
    timestamps: true, // 使用时间戳
  }
);

module.exports = userModel; // 导出该模块
