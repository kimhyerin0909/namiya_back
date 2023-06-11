const router = require("express").Router();
const db = require("../config/db.config");
const jwtController = require("../controller/jwt.controller");
const schedule = require("node-schedule");

const today = new Date();
const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

schedule.scheduleJob("0 44 21 * * *", () => {
  db.query(`SELECT * FROM Letter WHERE DATEDIFF(sendAt, '${todayStr}') = 0`, (err, rows) => {
    db.query(
      `UPDATE Letter SET replyUserId = ${rows[rows.length - 1].userId} WHERE userId = ${
        rows[0].userId
      }`
    );
    for (let i = 1; i < rows.length; i++) {
      db.query(
        `UPDATE Letter SET replyUserId = ${rows[i - 1].userId} WHERE userId = ${rows[i].userId}`
      );
    }
  });
});

router.post("/send/:userId", (req, res) => {
  const { userId } = req.params;
  const { content, sendAt, previousId } = req.body;
  if (jwtController.checkJWT(res, req.headers.authorization.split(" ")[1], userId)) {
    db.query(
      `SELECT * FROM Letter WHERE userId = ${userId} AND DATEDIFF(sendAt, '${sendAt}') = 0;`,
      (err, rows) => {
        if (rows.length > 0) return res.status(400).json({ message: "오늘 나야미가 존재합니다." });
        else {
          db.query(
            `INSERT INTO Letter VALUES (0, ${previousId}, ${userId}, "${sendAt}", "${content}", null)`,
            () => {
              res.status(200).json({ message: "성공!" });
            }
          );
        }
      }
    );
  }
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

router.get("/today/:userId", (req, res) => {
  const { userId } = req.params;
  if (jwtController.checkJWT(res, req.headers.authorization.split(" ")[1], userId)) {
    db.query(
      `SELECT * FROM Letter WHERE userId = ${userId} AND DATEDIFF(sendAt, '${todayStr}') = 0;`,
      (err, rows) => {
        if (rows.length > 0)
          return res
            .status(200)
            .json({ isExist: true, message: "오늘 나야미가 존재합니다.", data: rows[0] });
        else
          return res.status(200).json({ isExist: false, message: "나야미를 작성할 수 있습니다." });
      }
    );
  }
});

router.get("/reply/:userId", (req, res) => {
  const { userId } = req.params;
});

module.exports = router;
