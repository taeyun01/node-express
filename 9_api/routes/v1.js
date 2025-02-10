const express = require("express");
const router = express.Router();
const {
  createToken,
  tokenTest,
  getMyPosts,
  getPostsByHashtag,
} = require("../controllers/v1");

const { verifyToken } = require("../middlewares");

// v1/token
router.post("/token", createToken); // req.body.clientSecret (프론트에서 req.body로 보내줌)
router.get("/test", verifyToken, tokenTest);

//* 나의 게시글들을 가져갈 수 있게해주는 API라우터
router.get("/posts/my", verifyToken, getMyPosts);

//* 해시태그를 검색했을 때 관련 게시글들을 가져갈 수 있게 하는 라우터
router.get("/posts/hashtag/:title", verifyToken, getPostsByHashtag);

module.exports = router;
