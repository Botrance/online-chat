const DB = require("../config/dbconfig"); // 导入数据库配置文件

const {DataTypes} = require("sequelize");
const messageModel = DB.define(
  "message",
  {
    // "message"是info数据库下的表，第一个参数是表名
    id: {
      type: DataTypes.STRING(127),
      primaryKey: true,
      allowNull: false,
    },
    user_sender: {
      type: DataTypes.STRING(31),
      allowNull: false,
    },
    user_receiver: {
      type: DataTypes.STRING(31),
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING(1023),
      allowNull: false,
    },
    timestamp: {
      primaryKey: true,
      type: DataTypes.STRING(15),
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('timestamp');
        return rawValue ?  new Date(rawValue): null;
      }
    },
  },
  {
    freezeTableName: true, // 使用自定义表名
    timestamps: false, // 不使用时间戳
  }
);

module.exports = messageModel; // 导出该模块
