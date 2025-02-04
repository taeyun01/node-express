const passport = require("passport");
const { Strategy: KakaoStrategy } = require("passport-kakao");
const User = require("../models/user");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID, // 카카오 앱 아이디
        callbackURL: "/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("profile", profile); // 카카오 사용자 정보가 들어있음 (카카오에서 정보를 계속 바뀌므로 콘솔로 확인)

        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: "kakao" },
          });

          // 이미 가입된 사용자라면 로그인
          if (exUser) {
            done(null, exUser);
          } else {
            // 가입되지 않은 사용자라면 회원가입
            const newUser = await User.create({
              email: profile._json && profile._json.kakao_account.email, // 이 구조가 바뀔수도 있기 때문에 위 profile 콘솔 확인
              nick: profile.displayName,
              snsId: profile.id,
              provider: "kakao",
            });

            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
