const router = require("express").Router();
const jwtController = require("../controller/jwt.controller");

router.get("/all", (req, res) => {
  res.send("worry get");
});

router.post("/send", (req, res) => {
  jwtController.checkJWT(res, req.headers.authorization.split(" ")[1]);
});

module.exports = router;
