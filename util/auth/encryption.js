const crypto = require("crypto");

module.exports = (originPW) => {
  const cipher = crypto.createCipher("aes-256-cbc", process.env.PW_KEY);
  const pw = cipher.update(originPW, "utf-8", "base64") + cipher.final("base64");
  return pw;
};
