const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(morgan("dev")); // 요청과 응답을 기록하는 라우터 (개발때는 dev, 배포때는 combined)
// app.use(morgan("combined")); // IP, 시간, 요청 메서드, 요청 주소, 상태코드, 응답 시간, 브라우저가 뭔지 등등..

app.use(cookieParser()); // 쿠키를 파싱하는 라우터
app.use(cookieParser("password"));
app.use(express.json()); // 클라이언트에서 json형식으로 데이터를 보내는데 그 데이터를 파싱해서 req.body에 넣어준다. (json 파싱)
app.use(express.urlencoded({ extended: true })); // 클라이언트에서 폼 데이터를 보내는데 그 데이터를 파싱해서 req.body에 넣어준다. (폼 파싱)
// extended: true로 하면 qs라는 모듈을 쓰고, false로 하면 querystring모듈을 쓴다. qs가 훨씬 강력하기 때문에 추천
//* 다만 폼 데이터 보낼 때 이미지나 파일 같은건 urlencoded로 처리가 안되서 multer나 busboy같은 모듈을 써야 한다.

const name = "홍길동";

app.get("/", (req, res, next) => {
  req.cookies; // {mycookie: 'test'}
  req.signedCookies; // 암호화된 쿠키 (암호화 보단 서명)
  // 'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toUTCString()}; HttpOnly=true; Path=/`
  //* 위 코드랑 같음, 쿠키생성
  res.cookie("name", encodeURIComponent(name), {
    expires: new Date(),
    httpOnly: true,
    path: "/",
  });
  //* 쿠키 삭제
  res.clearCookie("name", encodeURIComponent(name), {
    httpOnly: true,
    path: "/",
  });
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/", (req, res, next) => {
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: true }));
  //* 위 라우터를 설정하면 req.body를 통해 데이터가 파싱되어 바로 쓸 수 있다.
  //* 클라이언트에서 json형식으로 데이터를 보내는데 그 데이터를 파싱해서 req.body에 넣어준다.
  req.body.name; // 홍길동
});

app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
