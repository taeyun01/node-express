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

exports.renderMain = (req, res) => {
  res.render("main", {
    title: "NodeSNS",
    twits: [],
  });
};
