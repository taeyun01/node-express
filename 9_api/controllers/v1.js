const { Domain, User } = require("../models");
const jwt = require("jsonwebtoken");

// 토큰 발급
exports.createToken = async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: [
        {
          model: User,
          attributes: ["id", "nick"],
        },
      ],
    });

    // 도메인이 없으면 에러 발생
    if (!domain) {
      return res
        .status(401)
        .json({ code: 401, message: "등록되지 않은 도메인입니다." });
    }

    // 도메인 있으면 토큰 생성하여 발급
    // jwt옵션들은 공식문서 확인
    const token = jwt.sign(
      // 토큰 내용들
      {
        id: domain.User.id, // 유저 아이디
        nick: domain.User.nick, // 유저 닉네임
      },
      process.env.JWT_SECRET, //
      {
        expiresIn: "1m", // 토큰 유효기간
        issuer: "nodesns", // 발급자
      }
    );

    return res.json({
      code: 200,
      message: "토큰이 발급되었습니다.",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 500, message: "서버 에러" }); // 서버에러를 내뱉지 않으면 브라우저는 기다리기만 함
  }
};

// 토큰 내용물들 다시 프론트에만 보내주는(표시해주는) 간단한 역할
exports.tokenTest = (req, res) => {
  res.json(res.locals.decoded);
};
