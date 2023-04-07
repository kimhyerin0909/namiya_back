const router = require("express").Router();

router.get("/all", (req, res) => {
  res.send("worry get");
});

module.exports = router;
