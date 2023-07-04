const messageModel = require("../model/message"); // 导入数据库模型
const authModel = require("../model/auth"); // 导入数据库模型
const roomModel = require("../model/room");// 导入数据库模型

const models = { auth: authModel, message: messageModel, room: roomModel };
const DB = require("../config/dbconfig");

const initTable = async function (name) {
  try {
    await models[name].sync();
    console.log(`Table ${name} initialized.`);
  } catch (error) {
    console.error(`Error initializing table ${name}:`, error);
  }
};

module.exports = {
  initTable,
  models,
};
