const express = require("express");
const router = express.Router();
const {
  createToken,
  tokenTest,
  getMyPosts,
  getPostsByHashtag,
} = require("../controllers/v1");

const { verifyToken, deprecated } = require("../middlewares");

//* 버전이 업그레이드 되었을때는 deprecated 미들웨어를 사용해서 새버전으로 업데이트 되었음을 알리기
router.use(deprecated); // 아래 라우터에 전부 공통으로 들어가므로 use로 사용

// v1/token
router.post("/token", createToken); // req.body.clientSecret (프론트에서 req.body로 보내줌)
router.get("/test", verifyToken, tokenTest);

//* 나의 게시글들을 가져갈 수 있게해주는 API라우터
router.get("/posts/my", verifyToken, getMyPosts);

//* 해시태그를 검색했을 때 관련 게시글들을 가져갈 수 있게 하는 라우터
router.get("/posts/hashtag/:title", verifyToken, getPostsByHashtag);

module.exports = router;
