const express = require("express");
const router = express.Router();
const { createToken, tokenTest } = require("../controllers/v1");

const { verifyToken } = require("../middlewares");

// v1/token
router.post("/token", createToken); // req.body.clientSecret (프론트에서 req.body로 보내줌)
router.get("/test", verifyToken, tokenTest);

module.exports = router;
