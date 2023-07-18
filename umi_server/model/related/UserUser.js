const DB = require("../../config/dbconfig"); // 导入数据库配置文件

const { DataTypes } = require("sequelize");

const UserUserModel = DB.define(
  "UserUser",
  {
    majorName: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false,
    },
    minorName: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  },
  {
    freezeTableName: true, // 使用自定义表名
    timestamps: false, // 不使用时间戳
    indexes: [{ fields: ["majorName","minorName"] }],
  }
);

module.exports = UserUserModel;
