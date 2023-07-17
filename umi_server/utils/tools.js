const crypto = require("crypto");

// 生成 32 位随机字符串作为 roomId
const generateRandomId = () => {
  const randomBytes = crypto.randomBytes(16);
  return randomBytes.toString("hex");
};

module.exports = {
  generateRandomId,
};
