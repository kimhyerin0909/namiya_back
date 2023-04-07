const jwt = require("jsonwebtoken");

module.exports = (email) => {
  return jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};
