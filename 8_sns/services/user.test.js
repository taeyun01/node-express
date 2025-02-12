jest.mock("../models/user");
const User = require("../models/user");
const { follow } = require("./user");

//* 서비스의 핵심로직만 테스트
//* req, res, next를 매번 작성하지 않아도됨 (요청과 응답을 모르는 상태로 핵심적인 로직만 분리해서 테스트)
//* 대신 컨트롤러와 서비스를 나눠야함 (테스트만을 위한건 아니지만 테스트 할 때 편함)
describe("follow", () => {
  test("사용자를 찾아 팔로잉을 추가하고 ok를 반환함", async () => {
    User.findOne.mockReturnValue({
      addFollowing(id) {
        return Promise.resolve(true);
      },
    });
    const result = await follow(1, 2);
    expect(result).toEqual("ok"); // 값이 같은지 확인
  });

  test("사용자를 찾지 못하면 no user를 반환함", async () => {
    User.findOne.mockReturnValue(null);
    const result = await follow(1, 2);
    expect(result).toEqual("no user");
  });
});
