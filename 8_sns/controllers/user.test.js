jest.mock("../models/user"); // jest가 User 모듈을 모킹해줌
const User = require("../models/user");
const { follow } = require("./user");

describe("follow", () => {
  test("사용자를 찾아 팔로잉을 추가하고 success를 응답해야함.", async () => {
    const req = {
      user: { id: 1 }, // 데이터는 그냥 모킹으로 처리 (가짜로 처리)
      params: { id: 2 },
    };
    const res = {
      send: jest.fn(),
    };
    const next = jest.fn();
    User.findOne.mockReturnValue({
      addFollowing(id) {
        return Promise.resolve(true);
      },
    });
    await follow(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });

  test("사용자를 못 찾으면 res.status(404).send(no user)를 호출함", async () => {
    const req = {
      user: { id: 1 },
      params: { id: 2 },
    };
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
    const next = jest.fn();
    User.findOne.mockReturnValue(null); // db에서 사용자 못찾으면 null 반환
    await follow(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no user");
  });

  test("DB에서 에러가 발생하면 next(error)를 호출함.", async () => {
    const req = {
      user: { id: 1 },
      params: { id: 2 },
    };
    const res = {};
    const next = jest.fn();
    const message = "DB에서 에러가 발생함.";
    User.findOne.mockReturnValue(Promise.reject(message));
    await follow(req, res, next);
    expect(next).toBeCalledWith(message);
  });
});
