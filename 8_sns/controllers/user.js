const User = require("../models/user");

exports.follow = async (req, res, next) => {
  // req.user.id, req.params.id
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });

    // DB에서 찾는 데이터가 없을수도 있음. 예외처리 꼭 하기
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
