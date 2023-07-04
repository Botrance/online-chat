const DB = require("../config/dbconfig"); // 导入数据库配置文件

const { DataTypes } = require("sequelize");

const authModel = DB.define(
  "auth",
  {
    // "auth"是info数据库下的表，第一个参数是表名
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
    friends: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      get() {
        const value = this.getDataValue("friends");
        return value ? value.split(",") : [];
      },
      set(value) {
        if (Array.isArray(value)) {
          this.setDataValue("friends", value.join(","));
        } else {
          this.setDataValue("friends", value);
        }
      },
    },
    rooms: {
      type: DataTypes.STRING(1024),
      allowNull: true,
      get() {
        const value = this.getDataValue("rooms");
        return value ? value.split(",") : [];
      },
      set(value) {
        if (Array.isArray(value)) {
          this.setDataValue("rooms", value.join(","));
        } else {
          this.setDataValue("rooms", value);
        }
      },
    },
  },
  {
    freezeTableName: true, // 使用自定义表名
    timestamps: true, // 使用时间戳
  }
);

module.exports = authModel; // 导出该模块
