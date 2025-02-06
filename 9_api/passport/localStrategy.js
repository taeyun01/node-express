const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");
const User = require("../models/user");

module.exports = () => {
  // 해당 사용자를 로그인 시켜도 되는지 안되는지 체크
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", // "email" == req.body.email (사용자가 입력한 이메일)
        passwordField: "password", // "password" == req.body.password (사용자가 입력한 패스워드)
        passReqToCallback: false, // true 일 경우 req.body 사용 가능
      },
      async (email, password, done) => {
        // done(서버실패, 성공유저, 로직실패)
        // 서버실패는 db요청이 실패하거나, 서버 코드 문법이 잘못된 경우 등등, done(error);
        // 성공유저는 db에 사용자 이메일도 있고, 패스워드도 비교했을 때 일치해서 로그인이 정상적으로 됐을 때, done(null, exUser);
        // 로직실패는 서버에러는 없는데 로그인을 시켜주면 안되는 경우 (세번째 인자에 이유를 적어줌), done(null, false, { message: "비밀번호가 일치하지 않습니다." });
        //* done()이 호출되는 순간 controller/auth.js에 passport.authenticate("local", (authError(서버실패), user(성공유저), info(로직실패)) ... 로 감
        try {
          // 이메일로 유저 찾기
          const exUser = await User.findOne({ where: { email } });

          // 유저가 있으면 비밀번호 비교
          if (exUser) {
            // bcrypt.hash가 암호화하는 거면 bcrypt.compare는 비교 (사용자가 입력한 패스워드랑, 데이터베이스에 저장된 패스워드랑 비교)
            const result = await bcrypt.compare(password, exUser.password);

            // 비밀번호가 일치하면 유저 정보 반환
            if (result) {
              done(null, exUser);
            } else {
              // 로직실패 (서버에러는 없는데 로그인을 시켜주면 안되는 경우) 세번째 인자에 이유를 적어줌
              done(null, false, { message: "비밀번호가 일치하지 않습니다." });
            }
          } else {
            // 유저가 없을때도 로직실패
            done(null, false, { message: "가입되지 않은 회원입니다." });
          }
        } catch (error) {
          console.error(error);
          done(error); // 예상치 못한 서버실패
        }
      }
    )
  );
};
