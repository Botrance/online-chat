const DB = require("../../config/dbconfig"); // 导入数据库配置文件

const { DataTypes } = require("sequelize");

const UserRoomModel = DB.define(
  "UserRoom",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    roomId: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    msgView: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true, // 使用自定义表名
    timestamps: false, // 不使用时间戳
    indexes: [{ fields: ["roomId","userId"] }],
  }
);

module.exports = UserRoomModel;
