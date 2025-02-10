const axios = require("axios");

const URL = process.env.API_URL; // api서버 url
axios.defaults.headers.origin = process.env.ORIGIN; // 요청 보내는 주소. 프론트 서버 주소 (내 주소)

// 토큰 발급 및 토큰 유효기간 지났으면 재발급, api요청도 하는 함수 (공통함수)
const request = async (req, api) => {
  try {
    // 토큰이 없으면 토큰 발급 (토큰은 세션에 저장되어있음)
    if (!req.session.jwt) {
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });

      // 토큰 발급 성공 시 세션에 토큰 저장
      req.session.jwt = tokenResult.data.token;
    }

    // 토큰이 있으면 api 요청
    return await axios.get(`${URL}${api}`, {
      // 토큰은 헤더에 넣어서 보내줌
      headers: { authorization: req.session.jwt },
    });
  } catch (error) {
    // 세션 유효기간이 지났을 때
    if (error.response?.status === 419) {
      delete req.session.jwt; // 토큰이 만료되었으면 세션에서 지워버림 (메모리에서 지워버림)
      return request(req, api); // 다시 재귀함수로 토큰 재발급 요청
    }
    // 토큰이 위조되었을 때
    // throw error.response; //* throw와 return의 차이점
    return error.response; //* return을 하면 에러가 없는거기 때문에 바로 getMyPosts 함수에 try로 넘어감. 그리고 화면에 json데이터로 표시됨
    // throw error.response; //* throw를 하면 에러가 있는거기 때문에 바로 getMyPosts 함수에 catch로 넘어감. 그리고 그리고 next(error)로 에러 처리 미드웨어 함수로 넘어가서 에러코드만 띄어줌
  }
};

// 내 게시글 조회
exports.getMyPosts = async (req, res, next) => {
  try {
    // console.log("Requesting my posts...");
    const result = await request(req, "/posts/my");
    // console.log("Received result:", result.data);
    res.json(result.data);
  } catch (error) {
    console.error("Error fetching my posts:", error);
    next(error);
  }
};

// 해시태그로 게시글 조회
exports.searchByHashtag = async (req, res, next) => {
  try {
    const result = await request(
      req,
      `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`
    ); // 주소창에 한글 인식 안될경우에는 encodeURIComponent로 한번 감싸줘야함
    res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 메인 페이지 렌더링
// 브라우저에서 서버로 요청할 때 무슨 문제가 발생하는지 확인
exports.renderMain = (req, res) => {
  res.render("main", {
    key: process.env.CLIENT_SECRET,
  });
};

// localhost:4000 서버에서 localhost:8002 api서버로 요청을 보내는 역할
// 토큰 테스트 라우터
// exports.test = async (req, res, next) => {
//   try {
//     // 세션에 토큰이 없으면 토큰을 발급 받음
//     if (!req.session.jwt) {
//       const tokenResult = await axios.post("http://localhost:8002/v1/token", {
//         clientSecret: process.env.CLIENT_SECRET, // 클라이언트 비밀 키가 올바르다면 토큰 발급이 될거임
//       });

//       // 만약 세션에 토큰이 있으면 해당 토큰 사용 (매번 토큰을 발급 받는건 비효율적 이므로 세션에 저장)
//       if (tokenResult.data?.code === 200) {
//         req.session.jwt = tokenResult.data.token; // 토큰 발급 성공 시 세션에 토큰 저장
//       } else {
//         // 토큰 발급 실패 시 에러 처리 (실패사유를 브라우저에 응답)
//         return res.status(tokenResult.data?.code).json(tokenResult.data);
//       }
//     }

//     // 세션에 jwt토큰이 저장된게 있으면 정상적인 토큰인지 검사 (발급받은 토큰 테스트)
//     const result = await axios.get("http://localhost:8002/v1/test", {
//       headers: { authorization: req.session.jwt }, // jwt토큰은 헤더에 authorization안에 넣는다 했음
//     });

//     return res.json(result.data);
//   } catch (error) {
//     console.error(error);
//     if (error.response?.data?.code === 419) {
//       // 토큰이 만료되었을 때 (419코드)
//       return res.json(error.response.data);
//     }
//     // 토큰이 위조되었을 때 (정상적인 토큰이 아닐 때)
//     next(error);
//   }
// };
