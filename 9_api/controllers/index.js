const { User, Domain } = require("../models");
const { v4: uuidv4 } = require("uuid");

exports.renderLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user?.id || null }, // 우선 나를 찾음 (where에는 undefined가 들어가면 안됨. 그래서 undefined인 경우에 null) 로그인을 안한상태로 login.html을 렌더링 하는경우에는 undefined가 될 수 있음
      include: {
        model: Domain, // 내가 가진 도메인을 찾음
      },
    });
    res.render("login", {
      user,
      domains: user?.Domains,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 도메인 등록
exports.createDomain = async (req, res, next) => {
  try {
    await Domain.create({
      UserId: req.user.id,
      host: req.body.host,
      type: req.body.type,
      clientSecret: uuidv4(), // 도메인 생성하면서 랜덤한 uuid를 도메인(clientSecret)에 부여를 해줌
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
