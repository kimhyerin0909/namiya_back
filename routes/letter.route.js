const router = require("express").Router();
const db = require("../config/db.config");
const jwtController = require("../controller/jwt.controller");

router.get("/all", (req, res) => {
  res.send("worry get");
});

router.post("/send", (req, res) => {
  jwtController.checkJWT(res, req.headers.authorization.split(" ")[1]);
});

router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  if (jwtController.checkJWT(res, req.headers.authorization.split(" ")[1], userId)) {
    db.query(`SELECT * FROM Letter WHERE userId = ${userId};`, (err, rows) => {
      if (rows.length < 1) return res.status(200).json({ message: "나야미가 없습니다." });
      else return res.status(200).json(rows);
    });
  }
});

module.exports = router;
