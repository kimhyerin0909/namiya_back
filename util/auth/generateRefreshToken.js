const jwt = require("jsonwebtoken");

module.exports = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30 days",
  });
};
