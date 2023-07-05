const DB = require("../config/dbconfig"); // 导入数据库配置文件

const { DataTypes } = require("sequelize");
const messageModel = DB.define(
  "message",
  {
    // "message"是info数据库下的表，第一个参数是表名
    id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      allowNull: false,
    },
    roomId: {
      primaryKey: true,
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    sender: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    time_CN: {
      type: DataTypes.VIRTUAL,
      get() {
        const timestamp = this.getDataValue("timestamp");
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        return `${year}年${month}月${day}日 ${hour}时${minute}分${second}秒`;
      },
    },
  },
  {
    freezeTableName: true, // 使用自定义表名
    timestamps: false, // 不使用时间戳
  }
);

module.exports = messageModel; // 导出该模块
