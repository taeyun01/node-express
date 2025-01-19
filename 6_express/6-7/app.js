const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const multer = require("multer");

const app = express();

app.set("port", process.env.PORT || 3000);

//* 미들웨어에도 순서가 중요하다. (미들웨어들은 내부적으로 next()를 가지고있다.)
app.use(morgan("dev"));
// app.use('요청 경로',express.static('실제 경로'));
// 요청경로: localhost:3000/my-web.html, 실제경로: 6-7/public-3030/my-web.html
// 요청경로: localhost:3000/hello.css,   실제경로: 6-7/public-3030/hello.css
// 위처럼 요청경로랑 실제경로가 다르면 보안에 좋다.
// 클라이언트에서 my-web.html나 hello.css 요청할때, 서버 구조를 제대로 파악하기 어렵다.
app.use("/", express.static(__dirname, "public")); // public폴더는 너무 유명하니까 나중에 바꿔서 사용

app.use(cookieParser());
// app.use(cookieParser("password"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
