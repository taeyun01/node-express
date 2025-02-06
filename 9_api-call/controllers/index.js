const axios = require("axios");

// localhost:4000 서버에서 localhost:8002 api서버로 요청을 보내는 역할
// 토큰 테스트 라우터
exports.test = async (req, res, next) => {
  try {
    // 세션에 토큰이 없으면 토큰을 발급 받음
    if (!req.session.jwt) {
      const tokenResult = await axios.post("http://localhost:8002/v1/token", {
        clientSecret: process.env.CLIENT_SECRET, // 클라이언트 비밀 키가 올바르다면 토큰 발급이 될거임
      });

      // 만약 세션에 토큰이 있으면 해당 토큰 사용 (매번 토큰을 발급 받는건 비효율적 이므로 세션에 저장)
      if (tokenResult.data?.code === 200) {
        req.session.jwt = tokenResult.data.token; // 토큰 발급 성공 시 세션에 토큰 저장
      } else {
        // 토큰 발급 실패 시 에러 처리 (실패사유를 브라우저에 응답)
        return res.status(tokenResult.data?.code).json(tokenResult.data);
      }
    }

    // 세션에 jwt토큰이 저장된게 있으면 정상적인 토큰인지 검사 (발급받은 토큰 테스트)
    const result = await axios.get("http://localhost:8002/v1/test", {
      headers: { authorization: req.session.jwt }, // jwt토큰은 헤더에 authorization안에 넣는다 했음
    });

    return res.json(result.data);
  } catch (error) {
    console.error(error);
    if (error.response?.data?.code === 419) {
      // 토큰이 만료되었을 때 (419코드)
      return res.json(error.response.data);
    }
    // 토큰이 위조되었을 때 (정상적인 토큰이 아닐 때)
    next(error);
  }
};
