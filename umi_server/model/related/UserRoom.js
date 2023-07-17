const DB = require("../../config/dbconfig"); // 导入数据库配置文件

const { DataTypes } = require("sequelize");

const UserRoomModel = DB.define(
  "UserRoom",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roomId: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(64),
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
  }
);

module.exports = UserRoomModel;
