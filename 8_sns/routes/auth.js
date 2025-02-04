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
router.get("/logout", isLoggedIn, logout);

// /auth/kakao
router.get("/kakao", passport.authenticate("kakao")); // 카카오 로그인 화면으로 redirect

// 카카오 로그인 화면에서 로그인이 완료되면 callback으로 이동
// /auth/kakao/callback
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/?loginError=카카오로그인 실패", // 로그인 실패시 리다이렉트
  }),
  (req, res) => {
    res.redirect("/"); // 성공시 메인
  }
);

module.exports = router;
