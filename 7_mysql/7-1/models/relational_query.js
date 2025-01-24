//* 관계 쿼리
//* 데이터베이스에서 서로 연관된 데이터를 조회하기 위해 사용되는 SQL 쿼리
const { User } = require("../models/user");

// 결과값이 자바스크립트 객체임
const user = await User.findOne({});
console.log(user.nick); // 사용자 닉네임

//* include로 JOIN 과 비슷한 기능 수행 가능 (관계 있는 것 엮을 수 있음)
// 내가 쓴 댓글 조회
const user2 = await User.findOne({
  // 사용자 가져오면서
  include: [
    {
      model: Comment, // 댓글도 가져와짐
    },
  ],
});
console.log(user2.Comments); // 특정 사용자 댓글을 모두 가져옴 (hasMany니까 복수형 Comments)

//* 다대다 모델은 다음과 같이 접근 가능
db.sequelize.models.PostHashtag;

//* get+모델명으로 관계 있는 데이터 로딩 가능
// 위 include랑 같지만 include는 한번에 가져오고, 이거는 user가져오고 또 댓글 가져옴. 총 2번 db 요청
const user3 = await User.findOne({});
const comments3 = await user3.getComments();
console.log(comments3); // 특정 사용자 댓글

//* as로 모델명 변경가능 (이름 바꿨다간 더 헷갈릴 수 있으니 그냥 사용)
db.User.hasMany(db.Comment, {
  foreignKey: "commenter",
  sourceKey: "id",
  as: "Answers",
});
// 쿼리할때
const user4 = await User.findOne({});
const comments4 = await user4.getAnswers(); // Answers라는 이름으로 가져옴
console.log(comments4); // 특정 사용자 댓글

//* include나 관계 쿼리 메서드에서도 where나 attributes를 사용할 수 있다.
// user의 where가 아닌 comment(댓글)의 where
// 예를 들어 특정 사용자의 댓글을 가져오는데, 댓글의 id가 1인 것만 가져오고 싶다면?
// 사용자의 id가 1인걸 원한다면 include밖에서 where 조건을 줘야함
const user5 = await User.findOne({
  include: [
    {
      model: Comment,
      where: {
        id: 1,
      },
      attributes: ["id"],
    },
  ],
});
// 또는
const comments = await user5.getComments({
  where: {
    id: 1,
  },
  attributes: ["id"],
});
console.log(comments); // 특정 사용자 댓글

//* 생성쿼리할 때 방법
const user6 = await User.findOne({});
const comment6 = await Comment.create();
await user6.addComment(comment6);
// 또는
await user6.addComments([comment6.id]);
console.log(comment6);

//* 여러개를 추가할 때는 배열로 추가가능
const user7 = await User.findOne({});
const comment7 = await Comment.create();
const comment8 = await Comment.create();
await user7.addComments([comment7, comment8]); // 배열로 저장

//* 수정은 set+모델명, 삭제는 remove+모델명

//* 직접 SQL을 쓸 수 있음
const [result, metadata] = await sequelize.query(
  "SELECT * FROM users WHERE id = 1"
);
console.log(result); // 쿼리 결과
