const DB = require("../../config/dbconfig"); // 导入数据库配置文件

const { DataTypes } = require("sequelize");

const UserUserModel = DB.define(
  "UserUser",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    majorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
    },
    minorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    freezeTableName: true, // 使用自定义表名
    timestamps: false, // 不使用时间戳
    indexes: [{ fields: ["majorId","minorId"] }],
  }
);

module.exports = UserUserModel;
