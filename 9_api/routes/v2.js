const express = require("express");
const router = express.Router();
const {
  createToken,
  tokenTest,
  getMyPosts,
  getPostsByHashtag,
} = require("../controllers/v2"); // 버전 변경 시 컨트롤러 파일 버전도 알맞게 변경

const { verifyToken, apiLimiter } = require("../middlewares");

// v1/token
router.post("/token", apiLimiter, createToken); // req.body.clientSecret (프론트에서 req.body로 보내줌)
router.get("/test", verifyToken, apiLimiter, tokenTest);

//* 나의 게시글들을 가져갈 수 있게해주는 API라우터
router.get("/posts/my", verifyToken, apiLimiter, getMyPosts);

//* 해시태그를 검색했을 때 관련 게시글들을 가져갈 수 있게 하는 라우터
router.get("/posts/hashtag/:title", verifyToken, apiLimiter, getPostsByHashtag);

module.exports = router;
