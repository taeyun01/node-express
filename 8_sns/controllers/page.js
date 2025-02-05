const Post = require("../models/post");
const User = require("../models/user");

// 컨트롤러는 서비스를 호출함
// 라우터는 컨트롤러를 호출하고 컨트롤러는 서비스를 호출함. (라우터 -> 컨트롤러 -> 서비스)
exports.renderProfile = (req, res) => {
  res.render("profile", {
    title: "내 정보 - NodeSNS",
  });
};

exports.renderJoin = (req, res) => {
  res.render("join", {
    title: "회원가입 - NodeSNS",
  });
};

exports.renderMain = async (req, res) => {
  try {
    // 게시글 조회
    const posts = await Post.findAll({
      // 게시글 작성자 조회
      include: {
        model: User,
        attributes: ["id", "nick"], // 사용자 아이디, 닉네임만 조회
      },
      order: [["createdAt", "DESC"]], // 최신순으로 정렬
    });
    res.render("main", {
      title: "NodeSNS",
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
