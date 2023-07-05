const jwt = require("jsonwebtoken");
const secretkey = "Botrance"; //密钥

// 生成token
const sign = (data = {}) => {
  return jwt.sign(data, secretkey, {
    expiresIn: 60 * 60,
  });
};

// 验证token
const verify = async (req, res) => {
  let authorization =
    req.headers.authorization || req.body.token || req.query.token || "";
  let token = "";
  if (authorization.includes("Bearer")) {
    token = authorization.replace("Bearer ", "");
  } else {
    token = authorization;
  }

  jwt.verify(token, secretkey, (error, data) => {
    if (error) {
      res.body = { code: 101, msg: "token验证失败" };
    } else {
      // console.log(data)
      res.body = { code: 100, msg: "token验证成功" };
    }
  });
};

module.exports = {
  secretKey: secretkey,
  sign,
  verify,
};
