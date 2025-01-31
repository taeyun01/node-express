const express = require("express");
const router = express.Router();
const {
  renderProfile,
  renderJoin,
  renderMain,
} = require("../controllers/page");

// 아래 라우터들에서(profile, join, main) 공통적으로 쓸 수 있는 변수들 정의
router.use((req, res, next) => {
  // 우선 빈값으로 설정
  res.locals.user = null;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followingIdList = [];
  next(); // 변수 설정 후 다음 미들웨어로 보냄
});

router.get("/profile", renderProfile);
router.get("/join", renderJoin);
router.get("/", renderMain);

module.exports = router;
