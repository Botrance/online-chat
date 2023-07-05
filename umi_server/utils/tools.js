const crypto = require("crypto");

// 生成 32 位随机字符串作为 roomId
const generateRandomId = () => {
  const randomBytes = crypto.randomBytes(16);
  const roomId = randomBytes.toString("hex");
  return roomId;
};

module.exports = {
  generateRandomId,
};
