const router = require("express").Router();
const encryption = require("../util/auth/encryption");
const db = require("../config/db.config");
const generateAccessToken = require("../util/auth/generateAccessToken");
const generateRefreshToken = require("../util/auth/generateRefreshToken");

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const pw = encryption(password);

  db.query(`SELECT * FROM User WHERE email = "${email}" AND password = "${pw}";`, (err, rows) => {
    if (rows.length < 1) res.json({ message: "로그인에 실패했습니다.", status: 406 });
    else if (rows.length === 1)
      res.json({
        user: req.body,
        message: "로그인에 성공했습니다!",
        status: 200,
        accessToken: generateAccessToken(email),
        refreshToken: generateRefreshToken(email),
      });
  });
});

router.post("/signup", (req, res) => {
  const { nickname, email, password } = req.body;
  const pw = encryption(password);

  db.query(`SELECT * FROM User WHERE email = "${email}"`, (err, rows) => {
    if (rows.length > 0) res.json({ message: "중복된 이메일입니다.", status: 406 });
    else {
      db.query(`INSERT INTO User VALUES (0, "${nickname}", "${email}", "${pw}");`, (err, rows) => {
        if (err) console.log(err);
        res.json({
          user: req.body,
          message: "회원가입에 성공했습니다!",
          status: 200,
          accessToken: generateAccessToken(email),
          refreshToken: generateRefreshToken(email),
        });
      });
    }
  });
});

module.exports = router;