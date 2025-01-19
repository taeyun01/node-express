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
app.use("/", express.static(__dirname, "public"));
app.use(cookieParser());
app.use(cookieParser("my-cookie-password"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  req.session; // 이렇게만 해줘도 사용자에 대한 세션을 가져온다.
  req.session.id = "hello"; // 모든 사용자의 id가 hello로 되는게 아닌, 요청을 보낸 사람의 id가 hello로 된다. (개인의 저장공간이 생기는 것이다.)
  // 요청마다 개인의 저장 공간을 만들어주는게 express-session이다.

  req.session({
    resave: false,
    saveUninitialized: false,
    secret: "my-cookie-password", // 쿠키 패스워드 (보통 위 cookieParser랑 같게 만들어두는 편)
    cookie: {
      // 세션인데 왜 쿠키를 쓰냐?? 세션일때 항상 쿠키를 쓰기 때문이다.
      httpOnly: true, // 자바스크립트 공격을 당하지 않기 위해 설정
    },
    name: "connect.sid", // 이름은 기본적으로 connect.sid라고 하지만, 뭔지 모르겠으면 그냥 sessionCookie라고 바꿔도 된다.
    // 그리고 값들은 서명되어 있기 떄문에 읽을 수 없는 문자열로 되어있다.
  });
  res.sendFile(path.join(__dirname, "index.html"));
});

// 미들웨어 끼리 값을 전달하고 싶을 때 (req, res 객체안에 값을 넣어 데이터 전달 가능)
//! 주의: 절대 let으로 전역변수로 공유하지 말것. 다른 사람이 볼 수 있음.
app.use((req, res, next) => {
  // req.session.data = '비번123' // 세션에 저장해도 되지만 다음 요청때도 데이터가 남아있어 일회성에는 좋지 않음
  req.data = "내 비밀번호는 1234입니다."; // 영구적이 아닌 일회성으로 요청한번에서만 데이터가 남게 하고 싶을 때
});

app.get("/", (req, res, next) => {
  req.data; // 내 비밀번호는 1234입니다.
  res.sendFile(path.join(__dirname, "index.html"));
  // 이렇게 해서 next()도 없고 끝나면 메모리가 정리되기 때문에 데이터가 남아있지 않다.
  //* 요청 한번만 쓰고 끝나는 데이터는 req.data, 나에 한에서 나라는것만 기억해서 유지되고 싶다면 req.session.data 사용
});

//? 알아두면 좋은 패턴 (미들웨어 확장법)
app.use((req, res, next) => {
  // 로그인을 해서 세션에 id가 있을 때
  if (req.session.id) {
    express.static(__dirname, "public")(req, res, next);
  } else {
    next(); // 없으면 다음 미들웨어로 이동
  }
});

app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
