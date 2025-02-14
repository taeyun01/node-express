const User = require("./user");

//* 테스트 커버리지를 올리기위한 의미없는 테스트긴함
//* 한번 테스트를 만들때 의미 있는 테스트를 만들어야함. 근데 어려움
describe("User 모델", () => {
  test("static initiate 메서드 호출", () => {
    expect(User.initiate(sequelize)).toBe(undefined);
  });

  test("static associate 메서드 호출", () => {
    const db = {
      User: {
        hasMany: jest.fn(),
        belongsToMany: jest.fn(),
      },
      Post: {},
    };
    User.associate(db);
    expect(db.User.hasMany).toHaveBeenCalledWith(db.Post);
    expect(db.User.belongsToMany).toHaveBeenCalledTimes(2);
  });
});
