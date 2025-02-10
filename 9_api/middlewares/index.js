const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const { User, Domain } = require("../models");

// 여러 라우터에서 공통적으로 쓰이는 미들웨어는 index.js에 모아둠

exports.isLoggedIn = (req, res, next) => {
  // 패스포트 통해서 로그인을 했을 때
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  // 패스포트 통해서 로그인을 하지 않았을 때
  if (!req.isAuthenticated()) {
    next();
  } else {
    // 이미 로그인을 했을 때
    // res.status(403).send("로그인 필요");
    const message = encodeURIComponent("로그인한 상태입니다.");
    res.redirect(`/?error=${message}`); // localhost:8001/?error=로그인한%20상태입니다.
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    // req.headers.authorization: 토큰은 여기 들어있는데, 토큰이라고 무조건 들어있는건 아니고. 사용자한테 토큰을 이 헤더에 넣어달라고 요청을함. 이 헤더에 토큰을 넣으면 우리가 서버에서 검사를 해주는것.
    // decoded: 검사가 끝나면 내용물을 decoded에 넣어줌
    res.locals.decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    ); // JWT_SECRET를 통해서 발급도 하고 검사도함(털리면 다 털렸다고 보면됨 (인감도장 같은거))
    return next();
  } catch (error) {
    // 토큰이 만료되었을 때 (유효기간 초과)
    if (error.name === "TokenExpiredError") {
      return res
        .status(419) // 이런 코드들은 임의로 지정함. 프론트랑 합의만 되어있으면 됨 (무슨 에러인지 제공)
        .json({ code: 419, message: "토큰이 만료되었습니다." });
    }
    // 토큰이 유효하지 않을 때 (토큰이 위조 되거나 등등..)
    return res
      .status(401)
      .json({ code: 401, message: "유효하지 않은 토큰입니다." });
  }
};

// 요청에 횟수제한을 두는 api limit
// rateLimit는 디도스공격 방어에는 효과가 없는 경우가 많다. 디도스는 여러명의 컴퓨터가 내 서버로 요청을 많이 보내는 것이기 때문에 요청이 전송만되면 공격 성공이다.
// rateLimit가 있다고해도 요청을 받은거니 요청을 받고나서 rateLimit가 걸러낸것이기 때문에 엄밀히 말하면 디도스 공격을 당한것이다.
//* 실무에서는 울가 보호해야할 서버 앞에 또 다른 서버를 하나 더 둔다. 그 서버에서 디도스 공격을 막아 방패막이 역할처럼 디도스공격인지 검사하는 서버를 둔다. (AWS나 cloudflare 등등에 이런 서비스들이 있다.)
exports.apiLimiter = async (req, res, next) => {
  let user;
  // 토큰이 있으면 사용자를 찾음 (decoded가 있으면 사용자를 찾아서 user에 넣음)
  if (res.locals.decoded) {
    user = await User.findOne({ where: { id: res.locals.decoded.id } }); // 사용자를 먼저 찾음
  }

  // if (!user) {
  //   return res.status(401).json({
  //     code: 401,
  //     message: "사용자가 존재하지 않습니다.",
  //   });
  // }

  rateLimit({
    windowMs: 60 * 1000, // 1분
    max: user?.type === "premium" ? 1000 : 10, // 1분에 딱 10번만 요청 가능 (premium 사용자는 1000번까지 요청 가능)
    handler(req, res) {
      res.status(this.statusCode).json({
        code: this.statusCode,
        message: "1분에 10번만 요청할 수 있습니다.",
      });
    },
  })(req, res, next);
};

// 버전 업데이트 되었을 때 사용하는 미들웨어 (옛날버전 사용하지말라는 메시지)
exports.deprecated = (req, res) => {
  res.status(410).json({
    code: 410,
    message: "새로운 버전이 나왔습니다. 새로운 버전을 사용해주세요.",
  });
};

// 도메인이 일치할 때만 cors 허용
exports.corsWhenDomainMatches = async (req, res, next) => {
  const domain = await Domain.findOne({
    where: {
      host: new URL(req.get("origin")).host, // 클라이언트 요청 주소의 도메인을 가져옴 (http를 떼고 도메인만 가져옴)
    },
  });

  // 도메인이 일치하면 cors 적용
  if (domain) {
    cors({
      origin: req.get("origin"),
      credentials: true,
    })(req, res, next);
  } else {
    // 도메인이 일치하지 않으면 cors 에러
    next();
  }
};
