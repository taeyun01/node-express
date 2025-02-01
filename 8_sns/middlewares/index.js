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
