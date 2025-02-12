const { isLoggedIn, isNotLoggedIn } = require("../../9_api/middlewares");

describe("isLoggedIn", () => {
  // 중복으로 사용되는 공통 객체는 빼내어 사용
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  test("로그인되어 있으면 isLoggedIn이 next를 호출해야함.", () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };

    isLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1); // next가 호출되었는지 확인
  });

  test("로그인되어 있지 않으면 isLoggedIn이 에러를 응답해야함.", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };

    isLoggedIn(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.send).toBeCalledWith("로그인 필요");
  });
});

describe("isNotLoggedIn", () => {
  const res = {
    redirect: jest.fn(),
  };
  const next = jest.fn();

  test("로그인되어 있으면 isNotLoggedIn이 에러를 응답해야함.", () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };

    isNotLoggedIn(req, res, next);
    const message = encodeURIComponent("로그인한 상태입니다.");
    expect(res.redirect).toBeCalledWith(`/?error=${message}`);
  });

  test("로그인되어 있지 않으면 isNotLoggedIn이 next를 호출해야함.", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };

    isNotLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
});
