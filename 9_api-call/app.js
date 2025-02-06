const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");

dotenv.config();

const indexRouter = require("./routes");
const app = express();

app.set("port", process.env.PORT || 4000);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

app.use(morgan("dev"));
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키파서 역할은 브라우저에서 보낸 쿠키를 { connect.sid: 123123123123 } 이 객체 형태로 만들어보내줌
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false, // https로 적용 시 true로 변경
    },
  })
);

app.use("/", indexRouter);

// pageRouter에 없는 라우터 에러처리 (404 NOT FOUND)
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error); // 에러처리 미들웨어로 보냄
});

// 에러처리 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500); // 에러가 뜨면 err.status는 404가 됨 위에 404에러처리 확인
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
