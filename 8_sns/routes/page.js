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
  res.locals.user = req.user;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followingIdList = [];
  next(); // 변수 설정 후 다음 미들웨어로 보냄
});

router.get("/profile", isLoggedIn, renderProfile);
router.get("/join", isNotLoggedIn, renderJoin);
router.get("/", renderMain);

module.exports = router;
