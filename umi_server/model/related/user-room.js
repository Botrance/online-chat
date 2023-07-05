const DB = require("../../config/dbconfig"); // 导入数据库配置文件

const { DataTypes } = require("sequelize");

const userModel = require("../model/user"); // 导入数据库模型
const roomModel = require("../model/room"); // 导入数据库模型

const UserRoom = sequelize.define('UserRoom', {
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

UserRoom.belongsTo(userModel, { foreignKey: { name: 'username', type: DataTypes.STRING(64) } });
UserRoom.belongsTo(roomModel, { foreignKey: { name: 'roomId', type: DataTypes.STRING(64) } });
userModel.hasMany(UserRoom, { foreignKey: { name: 'username', type: DataTypes.STRING(64) } });
roomModel.hasMany(UserRoom, { foreignKey: { name: 'roomId', type: DataTypes.STRING(64) } });