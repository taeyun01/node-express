const { User } = require("../models/user");

// 사용자 생성
// sql문 => INSERT INTO nodejs.users (name, age, married, comment) VALUES ('taeyun', 20, false, '자기소개 테스트');
User.create({
  name: "taeyun",
  age: 20,
  married: false,
  comment: "자기소개 테스트",
});

// 모든 사용자 조회
// sql문 => SELECT * FROM nodejs.users;
User.findAll({});

// 이름과 나이만 조회 (일부 컬럼만 조회)
// sql문 => SELECT name, married FROM nodejs.users;
User.findAll({
  attributes: ["name", "married"],
});

//* 조건문 쓸 때
// 특수한 기능들인 경우 Sequelize.Op의 연산자 사용(gt, or등)
const { Op } = require("sequelize");
const { User } = require("../models/user");

// 결혼 여부가 true 이고 나이가 30보다 큰 사용자 조회 (AND 조건문 쓸 때)
// sql문 => SELECT name, age FROM nodejs.users WHERE married = 1 AND age > 30;
User.findAll({
  attributes: ["name", "age"],
  where: {
    married: true, // 결혼 여부 (시퀄라이즈는 true, false로 표현) (sql은 1, 0으로 표현)
    age: {
      [Op.gt]: 30, // 나이가 30보다 큰 사용자 조회 gt(>) lt(<) gte(>=) lte(<=) eq(=) ne(!=)등등.. Op = operator gt(>) = greater than
    },
  },
});

// OR 조건문 쓸 때 (좀 더 복잡)
User.findAll({
  attributes: ["id", "name"],
  where: {
    [Op.or]: [
      {
        married: false,
      },
      {
        age: {
          [Op.gt]: 30,
        },
      },
    ],
  },
});

// 나이 내림차순 정렬
// sql문 => SELECT id, name FROM users ORDER BY age DESC;
User.findAll({
  attributes: ["id", "name"],
  order: [["age", "DESC"]], // 정렬 order는 기본적으로 2차원 배열 [['age', 'DESC'], ['createdAt', 'ASC']] 1순위 age, 2순위 createdAt
});

// sql문 => SELECT id, name FROM users ORDER BY age DESC LIMIT 1 OFFSET 1;
User.findAll({
  attributes: ["id", "name"],
  order: [["age", "DESC"]],
  limit: 1, // 조회 개수 제한
  offset: 1, // 조회 시작 위치
});

//* 수정
// sql문 => UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id = 2;
User.update(
  {
    comment: "바꿀 내용",
  },
  {
    where: { id: 2 },
  }
);

//* 삭제
// sql문 => DELETE FROM nodejs.users WHERE id = 2;
User.destroy({
  where: { id: 2 }, // 정확히 뭘 지울지 조건을 걸어줘야함 (그렇지 않으면 테이블 다 날아갈 수 있음)
});

//* in은 어떨때 쓰냐?
// 예를 들어 1번 3번 5번을 지우고 싶다 했을 때,
User.destroy({
  where: {
    id: { [Op.in]: [1, 3, 5] }, // 1, 3, 5가 들어있는 id를 지우라는 의미
    // id: { [Op.ne]: 5 }, // 5가 아닌 나머지 id를 전부 지우라는 의미 (ne = not equal)
  },
});

// 시퀄라이즈 공식문서 참조 : https://sequelize.org/docs/v6/core-concepts/model-basics/
