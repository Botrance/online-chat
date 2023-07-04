const DB = require("../config/dbconfig"); // 导入数据库配置文件
const { DataTypes } = require("sequelize");
const Sequelize = require("sequelize");

const roomModel = DB.define(
  "room",
  {
    roomId: {
      // id与数据库中的列名保持一致
      type: Sequelize.STRING(64),
      primaryKey: true, // 主键
      unique: true, // 唯一的键
      allowNull: false,
    },
    roomName: {
      type: Sequelize.STRING(64),
      allowNull: true,
    },
    roomType: {
      type: Sequelize.STRING(32),
      allowNull: false, //private,public
    },
    users: {
      type: DataTypes.STRING(1024),
      allowNull: false,
      get() {
        const value = this.getDataValue("users");
        return value ? value.split(",") : [];
      },
      set(value) {
        if (Array.isArray(value)) {
          this.setDataValue("users", value.join(","));
        } else {
          this.setDataValue("users", value);
        }
      },
    },
  },
  {
    freezeTableName: true, // 使用自定义表名
    timestamps: false, // 不使用时间戳
  }
);

module.exports = roomModel; // 导出该模块
