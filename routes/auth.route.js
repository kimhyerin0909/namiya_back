const router = require("express").Router();
const encryption = require("../util/auth/encryption");
const db = require("../config/db.config");
const jwtController = require("../controller/jwt.controller");
const generateAccessToken = require("../util/auth/generateAccessToken");
const generateRefreshToken = require("../util/auth/generateRefreshToken");

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const pw = encryption(password);

  db.query(`SELECT * FROM User WHERE email = "${email}" AND password = "${pw}";`, (err, rows) => {
    if (rows.length < 1) return res.status(406).json({ message: "로그인에 실패했습니다." });
    else
      res.status(200).json({
        user: rows[0],
        message: "로그인에 성공했습니다!",
        accessToken: generateAccessToken(rows[0].userId),
        refreshToken: generateRefreshToken(rows[0].userId),
      });
  });
});

router.post("/signup", (req, res) => {
  const { nickname, email, password } = req.body;
  const pw = encryption(password);

  db.query(`SELECT * FROM User WHERE email = "${email}"`, (err, rows) => {
    if (rows.length > 0) res.status(406).json({ message: "중복된 이메일입니다." });
    else {
      db.query(`INSERT INTO User VALUES (0, "${nickname}", "${email}", "${pw}");`, (err, rows) => {
        if (err) return console.log(err);
        return res.status(200).json({
          user: rows[0],
          message: "회원가입에 성공했습니다!",
          accessToken: generateAccessToken(rows.insertId),
          refreshToken: generateRefreshToken(rows.insertId),
        });
      });
    }
  });
});

router.get("/reissuanceToken", (req, res) => {
  jwtController.reissuanceToken(res, req.headers.authorization.split(" ")[1]);
});

module.exports = router;
