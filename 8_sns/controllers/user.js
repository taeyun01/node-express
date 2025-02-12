const User = require("../models/user");
const { follow } = require("../services/user");

exports.follow = async (req, res, next) => {
  // req.user.id, req.params.id
  try {
    const result = await follow(req.user.id, req.params.id);

    // DB에서 찾는 데이터가 없을수도 있음. 예외처리 꼭 하기
    if (result === "ok") {
      res.send("success");
    } else if (result === "no user") {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.unfollow = async (req, res, next) => {
  // req.user.id, req.params.id
  // console.log("내 아이디: ", req.user.id); // 숫자
  // console.log("상대 아이디: ", req.params.id); // 문자열
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });

    if (user) {
      await user.removeFollowing(parseInt(req.params.id, 10));
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
