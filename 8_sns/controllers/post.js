const Post = require("../models/post");
const Hashtag = require("../models/hashtag");

exports.afterUploadImage = (req, res) => {
  console.log("이미지 업로드!!", req.file);
  // 이미지 업로드가 되면 업로드된 이미지url을 프론트로 보내줌
  res.json({ url: `/img/${req.file.filename}` });
};

exports.uploadPost = async (req, res) => {
  // 게시글 업로드시 프론트에서 content와 url을 보내줌 (req.body.content, req.body.url로 접근)
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    // await post.addUser(req.user.id); // 이렇게 UserId를 추가해도 되지만, 쿼리를 한번더 날리는것보다 위 처럼 한번에 처리하는게 좋음
    // 게시글이 만약 "안녕하세요. #인사 #개발 굿" 여기서 해시태그를 추출해야함. /#[^\s#]*/g (#과 공백이 아닌 나머지 '#하이' '#오오')
    const hashtags = post.content.match(/#[^\s#]*/g); // 해시태그 추출
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      console.log("해시태그 추출 결과", result);
      await post.addHashtags(result.map((r) => r[0])); // 게시글에 해시태그 추가(모델들만 추출해서(0번째 있는) post랑 이어줌)
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
