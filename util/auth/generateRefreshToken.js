const jwt = require("jsonwebtoken");

module.exports = (email) => {
  return jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30 days",
  });
};
