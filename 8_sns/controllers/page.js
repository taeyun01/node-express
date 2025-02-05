const Post = require("../models/post");
const User = require("../models/user");
const Hashtag = require("../models/hashtag");

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

exports.renderHashtag = async (req, res, next) => {
  // 프론트로 부터 요청에 어떤 정보가 들어있는지. req.query인지 req.body인지 req.params인지 미리 생각해놓고 받은 정보들로 서버에서 처리
  const query = req.query.hashtag;

  // 프론트에서 보내는 값이 꼭 있다는 보장은 없음.
  if (!query) {
    return res.redirect("/");
  }

  // 해시태그 찾기 -> 해시태그에 해당하는 게시글 찾기 -> 화면에 렌더링
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } }); // 해시태그 조회

    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({
        include: [
          {
            model: User,
            attributes: ["id", "nick"],
          },
        ],
        order: [["createdAt", "DESC"]], // 최신순
      }); // 해시태그에 해당하는 게시글 조회 (해시태그랑 포스트랑 관계를 맺어놨기 때문에 가능)
    }

    // 게시글들 찾았으면 화면에 렌더링
    res.render("main", {
      title: `${query} | NodeSNS`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
