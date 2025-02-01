const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user"); // 회원 가입 시 유저 테이블에 정보를 저장하기 위해 가져옴

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } })
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();
};

// 로그인 흐름 (전체 과정)
// 1. /auth/login 라우터를 통해 로그인 요청이 들어옴
// 2. 라우터에서 passport.authenticate("local") 호출
// 3. 로그인 전략(LocalStrategy) 수행
// 4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
// 5. req.login 메서드가 passport.serializeUser 호출
// 6. req.session에 사용자 아이디만 저장해서 세션 생성
// 7. express-session에 설정한 대로 브라우저에 connect.sid 세션 쿠키 전송
// 8. 로그인 완료
