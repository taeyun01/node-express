const express = require("express");

const router = express.Router();

// GET /user 라우터 (GET /user/)
router.get("/", (req, res) => {
  res.send("Hello, User");
});

module.exports = router;
