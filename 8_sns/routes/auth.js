const express = require("express");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { join, login, logout } = require("../controllers/auth");
const router = express.Router();

// POST /auth/join (회원가입, 로그인 안한 사람들만 가능)
router.post("/join", isNotLoggedIn, join);
// POST /auth/login (로그인, 로그인 안한 사람들만 가능)
router.post("/login", isNotLoggedIn, login);
// POST /auth/logout (로그아웃, 로그인 한 사람들만 가능)
router.post("/logout", isLoggedIn, logout);

module.exports = router;
