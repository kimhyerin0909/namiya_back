const jwt = require("jsonwebtoken");
const generateAccessToken = require("../util/auth/generateAccessToken");

module.exports = {
  checkJWT: (res, authorization) => {
    if (!authorization) {
      return res.status(401).json({
        message: "로그인이 필요합니다.",
      });
    }

    try {
      let payload = jwt.verify(authorization, process.env.ACCESS_TOKEN_SECRET);
      return res.json({ payload: payload, message: "검증되었습니다." });
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "만료된 토큰입니다." });
      }
      return res.status(405).json({ message: err.name });
    }
  },

  reissuanceToken: (res, refreshToken) => {
    try {
      let payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      return res.json({
        accessToken: generateAccessToken(payload.email),
        message: "토큰이 발급되었습니다.",
      });
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "만료된 토큰입니다." });
      }
      console.log(err);
      return res.status(405).json({ message: err.name });
    }
  },
};
