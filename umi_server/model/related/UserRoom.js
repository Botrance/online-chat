const DB = require("../../config/dbconfig"); // 导入数据库配置文件

const { DataTypes } = require("sequelize");

const UserRoomModel = DB.define("UserRoom", {
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
});

module.exports = UserRoomModel;