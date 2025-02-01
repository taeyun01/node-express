const passport = require("passport");
const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const User = require("../models/user"); // 회원 가입 시 유저 테이블에 정보를 저장하기 위해 가져옴

module.exports = () => {
  // user === exUser
  passport.serializeUser((user, done) => {
    done(null, user.id); // user id만 추출
    // 서버의 세션은 { 1290123412: 1} 이런 객체 형태로 저장됨, 1290123412는 세션쿠키, 1은 유저 아이디 { 세션쿠키: 유저아이디 } -> 메모리에 저장됨
    // 유저정보를 전부 저장하면 메모리가 부하되기 때문에 유저 아이디만 저장해서 세션 생성
    // 근데 결국에 유저 아이디만 저장해도 결국에는 메모리는 차지하기 때문, 컴퓨터 한대에 메모리 하나인데 서비스가 커지면 서버를 여러대 띄우면서 서로간의 공유를 해야하는데 그게 안되서 어떤 서버에는 로그인이 돼있고 어떤 서버에는 안돼있고 이럴수 있기 때문에
    // 나중에는 공유된 메모리 즉, 메모리 서버를 따로 둬서 거기다 저장을 한다. (나중에 사용해보자)
  });

  // 세션{ 1290123412: 1}에서 유저아이디를 찾음 id: 1
  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } }) // 그 id로 부터 db에서 유저 정보를 찾음
      .then((user) => done(null, user)) // 찾은 유저는 req.user에 저장, req.session은 connect.sid쿠키로 세션에서 찾을 때 생성된다.
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
