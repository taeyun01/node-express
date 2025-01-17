const express = require("express");
const path = require("path");

const app = express();

app.set("port", process.env.PORT || 3000); // 어디서든지 app.get("port")로 접근하여 사용가능 (전역 변수같은 느낌)

// 미들웨어는 라우터에 공통된 코드를 넣어주면 모든 코드에서 실행된다.
app.use((req, res, next) => {
  console.log("모든 요청에 다 실행됩니다.");
  next(); // 다음 라우터로 넘긴다. 미들웨어는 next()를 하지 않으면 다음을 실행하지 않는다.
});

//* 동적 라우트랑 비슷하다. 모든 get요청 어떠한 주소든지 다 처리한다. (얘는 최상위에 있으면 아래 라우트들은 실행되지 않는다)
//* 이렇게 범위가 넓은 라우터들은 아래쪽에 배치해주는게 좋다.
// app.get("*", (req, res) => {
//   res.send("* : 모든 get요청에 대응 어떤 주소든지 다 처리 ");
// });

app.get("/", (req, res) => {
  // console.log("모든 요청에 다 실행됩니다.");
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/", (req, res) => {
  // console.log("모든 요청에 다 실행됩니다.");
  res.send("Hello Express post");
});

//* 순서변경
app.get("/category/Javascript", (req, res) => {
  res.send(`category: Javascript`); // 라우트 매개변수(:name)를 가져와 사용할 수 있다.
});

// 라우트 매개변수를 사용하여 동적으로 경로를 지정할 수 있다.
app.get("/category/:name", (req, res) => {
  // res.send(`category: ${req.params.name}`); // 라우트 매개변수(:name)를 가져와 사용할 수 있다.
  res.send(`category: 동적 라우트`);
});

//* 위 라우트로 인해 /category/Javascript를 해도 이 라우트는 실행되지 않는다.
//* 동적 라우트 위로 순서를 바꿔주면 두개 다 대응이 된다.
// app.get("/category/Javascript", (req, res) => {
//   res.send(`category: Javascript`); // 라우트 매개변수(:name)를 가져와 사용할 수 있다.
// });

app.get("/about", (req, res) => {
  // console.log("모든 요청에 다 실행됩니다.");
  res.send("About Express");
});

app.get("*", (req, res) => {
  res.send("* : 모든 get요청에 대응 어떤 주소든지 다 처리 ");
});

app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
