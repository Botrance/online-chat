const messageModel = require("../model/message"); // 导入数据库模型
const authModel = require("../model/auth"); // 导入数据库模型

const models={auth:authModel,message:messageModel}
const DB = require("../config/dbconfig");

const initTable=async function(name){
  const tables = await DB.getQueryInterface().showAllTables();
  if (!tables.includes(name)) {
    await DB.getQueryInterface().createTable(
      models[name].tableName,
      models[name].getAttributes()
    );
  }
}

module.exports ={
  initTable,
  models
}