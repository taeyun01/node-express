const express = require("express");
const router = express.Router();
const {
  createToken,
  tokenTest,
  getMyPosts,
  getPostsByHashtag,
} = require("../controllers/v2"); // 버전 변경 시 컨트롤러 파일 버전도 알맞게 변경
const cors = require("cors");

const {
  verifyToken,
  apiLimiter,
  corsWhenDomainMatches,
} = require("../middlewares");

// 원래는 cors에러 메세지가 뜨면 헤더에 일일히 넣어줘야하는데, 복잡하기도 ㅇ하고 또 어떤 에러가 나올지 모르니 cors모듈 사용
// router.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:4000");
//   res.setHeader("Access-Control-Allow-Headers", "content-type");
//   next();
// });

router.use(corsWhenDomainMatches);

// v1/token
router.post("/token", apiLimiter, createToken); // req.body.clientSecret (프론트에서 req.body로 보내줌)
router.get("/test", verifyToken, apiLimiter, tokenTest);

//* 나의 게시글들을 가져갈 수 있게해주는 API라우터
router.get("/posts/my", verifyToken, apiLimiter, getMyPosts);

//* 해시태그를 검색했을 때 관련 게시글들을 가져갈 수 있게 하는 라우터
router.get("/posts/hashtag/:title", verifyToken, apiLimiter, getPostsByHashtag);

module.exports = router;
