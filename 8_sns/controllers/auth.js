const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.join = async (req, res, next) => {
  // 회원가입은 패스포트를 사용할 일이 없다. 그냥 회원정보를 DB에만 저장하면 됨
  const { nick, email, password } = req.body; // 폼에서 보낸 데이터
  try {
    // 먼저 해당 이메일로 가입한 유저가 있는지 확인
    const exUser = await User.findOne({ where: { email } });

    // 이미 가입한 유저가 있을 때
    if (exUser) {
      return res.redirect("/join?error=exist");
    }

    // 가입하지 않았으면 비밀번호 암호화
    const hash = await bcrypt.hash(password, 12); // 높을수록 보안성 증가하지만 속도 느려짐

    // 유저 생성
    await User.create({
      nick,
      email,
      password: hash, // 암호화된 비밀번호 저장
    });

    return res.redirect("/"); // 회원가입 완료 후 메인 페이지로 이동 (302 응답 코드 : 위 코드를 정상적으로 실행 후 이동했다는 의미)
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.login = (req, res, next) => {
  console.log(req.body);
};

exports.logout = (req, res, next) => {
  console.log(req.body);
};
