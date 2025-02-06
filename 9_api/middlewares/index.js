const jwt = require("jsonwebtoken");

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
