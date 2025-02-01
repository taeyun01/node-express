const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const passport = require("passport");

const { sequelize } = require("./models"); // db객체 안에 들어있는 sequelize

dotenv.config(); // process.env

const pageRouter = require("./routes/page"); // 페이지들을 해당 파일에 몰아둠
const authRouter = require("./routes/auth");
const passportConfig = require("./passport");

const app = express();
passportConfig();

app.set("port", process.env.PORT || 8001); // 포트번호 설정
app.set("view engine", "html"); // 뷰엔진 설정 (페이지들 확장자는 html)
nunjucks.configure("views", {
  express: app,
  watch: true,
});

// sync를 해야지만 데이터베이스 연결이됨
sequelize
  .sync()
  // .sync({ force: true }) // 혹시나 개발시에 테이블 잘못만들었을 때 사용하면 서버 재시작 후 테이블이 전부 제거됐다가 재생성됨. 배포할땐 절대 사용하면 안됨
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan("dev")); // 로깅. 나중에 배포할 땐 combined로 변경
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // req.body를 ajax json 요청으로 부터 받아옴
app.use(express.urlencoded({ extended: false })); // 폼 데이터 전송 시 req.body를 만들어줌(저장) form에서 보낸 name에 따라 저장됨. ex) name="nick" => req.body.nick
app.use(cookieParser(process.env.COOKIE_SECRET));
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
// 패스포트에 필요한 미들웨어 설정 (반드시 세션 아래에 있어야함)
app.use(passport.initialize()); // 패스포트를 연결 할 때 req.user, req.login, req.logout, req.isAuthenticated() 생성되어 사용 가능
app.use(passport.session()); // connect.sid라는 이름으로 세션쿠키가 브라우저로 전송 (패스포트는 기본적으로 쿠키로 로그인함)

app.use("/", pageRouter);
app.use("/auth", authRouter);

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
