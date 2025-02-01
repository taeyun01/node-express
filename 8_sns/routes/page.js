const express = require("express");
const router = express.Router();
const {
  renderProfile,
  renderJoin,
  renderMain,
} = require("../controllers/page");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");

// 아래 라우터들에서(profile, join, main) 공통적으로 쓸 수 있는 변수들 정의
router.use((req, res, next) => {
  // req.locals는 미들웨어간에 공유되는 데이터, req.session은 사용자간에 공유되는 데이터. 같은 사용자면 로그아웃하기 전까지는 req.session에 데이터가 공유가됨
  res.locals.user = req.user; // req.user는 passport.deserializeUser에서 설정됨, 로그인 안했으면 req.user가 null
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followingIdList = [];
  next(); // 변수 설정 후 다음 미들웨어로 보냄
});

router.get("/profile", isLoggedIn, renderProfile);
router.get("/join", isNotLoggedIn, renderJoin);
router.get("/", renderMain);

module.exports = router;
