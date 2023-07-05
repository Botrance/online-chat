const messageModel = require("../model/message"); // 导入消息模型
const userModel = require("../model/user"); // 导入用户模型
const roomModel = require("../model/room"); // 导入房间模型
const UserRoomModel = require("../model/related/UserRoom"); // 导入关联表模型

const models = {
  user: userModel,
  message: messageModel,
  room: roomModel,
  UserRoom: UserRoomModel,
};
const { DataTypes } = require("sequelize");


const initTable = async function (name) {
  try {
    await models[name].sync();
    console.log(`Table ${name} initialized.`);
  } catch (error) {
    console.error(`Error initializing table ${name}:`, error);
  }
};

// 同步所有模型到数据库
const syncModels = async function () {
  try {
    await Promise.all(Object.values(models).map((model) => model.sync()));
    console.log("All models synchronized.");
  } catch (error) {
    console.error("Failed to sync models:", error);
  }
};

// 定义关联关系
const defineAssociations = function () {
  UserRoomModel.belongsTo(userModel, {
    foreignKey: { name: "username", type: DataTypes.STRING(64) },
  });
  UserRoomModel.belongsTo(roomModel, {
    foreignKey: { name: "roomId", type: DataTypes.STRING(64) },
  });
  userModel.hasMany(UserRoomModel, {
    foreignKey: { name: "username", type: DataTypes.STRING(64) },
  });
  roomModel.hasMany(UserRoomModel, {
    foreignKey: { name: "roomId", type: DataTypes.STRING(64) },
  });
};

// 初始化表和定义关联关系
const initialize = async function () {
  for (const name in models) {
    await initTable(name);
  }
  defineAssociations();
};

module.exports = {
  initialize,
  syncModels,
  models,
};
