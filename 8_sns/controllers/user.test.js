jest.mock("../models/user");
const User = require("../models/user");
const { follow } = require("./user");

//* 컨트롤러는 나중가면 요청(req), 응답(res) 이런것만 테스트 하게됨
//* 요청 제대로 보냈는지, 응답 제대로 받았는지 테스트
//* 핵심로직은 service에서 테스트하고 컨트롤러는 그 로직의 요청과 응답을 호출하는지 테스트
//* 서비스 로직이 1순위 컨트롤러 요청, 응답은 너무 바쁘다 싶으면 서비스 로직만 테스트
describe("follow", () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };

  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };

  const next = jest.fn();

  test("사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함", async () => {
    User.findOne.mockReturnValue({
      addFollowing(id) {
        return Promise.resolve(true);
      },
    });
    await follow(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });

  test("사용자를 못 찾으면 res.status(404).send(no user)를 호출함", async () => {
    User.findOne.mockReturnValue(null);
    await follow(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no user");
  });

  test("DB에서 에러가 발생하면 next(error) 호출함", async () => {
    const message = "DB에러";
    User.findOne.mockReturnValue(Promise.reject(message));
    await follow(req, res, next);
    expect(next).toBeCalledWith(message);
  });
});
