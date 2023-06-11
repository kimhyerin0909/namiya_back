const jwt = require("jsonwebtoken");

module.exports = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
};
