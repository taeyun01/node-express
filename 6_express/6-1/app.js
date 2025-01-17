const express = require("express");
const path = require("path");

const app = express();

app.set("port", process.env.PORT || 3000); // 어디서든지 app.get("port")로 접근하여 사용가능 (전역 변수같은 느낌)

// 미들웨어는 라우터에 공통된 코드를 넣어주면 모든 코드에서 실행된다.
// 미들웨어를 여러개 동시에 넣을 수도 있다.
app.use(
  (req, res, next) => {
    console.log("1. 모든 요청에 다 실행됩니다.");
    next();
  },
  (req, res, next) => {
    console.log("2. 모든 요청에 다 실행됩니다.");
    next();
  },
  (req, res, next) => {
    console.log("3. 모든 요청에 다 실행됩니다.");
    next();
  }
  // 미들웨어나 아래 라우트들에 에러가 발생하면 에러가 어디서 났는지, 상태코드는 몇인지 알려줌
  // 그리고 맨 아래 작성한 에러 미들웨어가 실행된다.
  // (req, res, next) => {
  //   throw new Error("에러 발생");
  // }
);

//* 동적 라우트랑 비슷하다. 모든 get요청 어떠한 주소든지 다 처리한다. (얘는 최상위에 있으면 아래 라우트들은 실행되지 않는다)
//* 이렇게 범위가 넓은 라우터들은 아래쪽에 배치해주는게 좋다.
// app.get("*", (req, res) => {
//   res.send("* : 모든 get요청에 대응 어떤 주소든지 다 처리 ");
// });

app.get("/", (req, res) => {
  // console.log("모든 요청에 다 실행됩니다.");
  res.sendFile(path.join(__dirname, "index.html"));
  // res.send("안녕 안녕 안녕"); // 한 라우터 안에서 send를 두번 이상 쓸 수 없다. 에러남
  // res.json({ message: "Hello Express" }); // 또 비슷한게 json이 있다. (한 라우터안에 send 2개 이상과 json을 같이 쓸 수 없다.)
  // 요청 한번에 응답 한번 해줘야하는데 이 라우터는 요청 한번에 응답 3번을 해주고 있다.
  // res.writeHead(); // 응답을 보내고 writeHead를 쓰면 Head를 왜쓰냐고 에러를 냄
  res.setHeader("Content-Type", "text/html");
  res.status(200).send("안녕 안녕 안녕");
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
// app.get("/category/:name", (req, res) => {
//   // res.send(`category: ${req.params.name}`); // 라우트 매개변수(:name)를 가져와 사용할 수 있다.
//   res.send(`category: 동적 라우트`);
// });

//* 위 라우트로 인해 /category/Javascript를 해도 이 라우트는 실행되지 않는다.
//* 동적 라우트 위로 순서를 바꿔주면 두개 다 대응이 된다.
// app.get("/category/Javascript", (req, res) => {
//   res.send(`category: Javascript`); // 라우트 매개변수(:name)를 가져와 사용할 수 있다.
// });

app.get("/about", (req, res) => {
  // console.log("모든 요청에 다 실행됩니다.");
  res.send("About Express");
});

// app.get("*", (req, res) => {
//   res.send("* : 모든 get요청에 대응 어떤 주소든지 다 처리 ");
// });

// 404처리하는 라우트
app.use((req, res, next) => {
  res.status(200).send("404: 페이지를 찾을 수 없습니다."); // 200성공 코드인데 404라고 뻥칠 수 있다.
});

//* 에러 미들웨어는 매개변수 맨 앞에 err가 있어야 하고 반드시 4개의 매개변수가 있어야 한다. (err, req, res, next) 하나 라도 빠지면 다른 함수로 친다.
app.use((err, req, res, next) => {
  console.error(err);
  // res.status(500).send("에러 발생");
  res.status(200).send("에러가 났지만 알려줄 수 없습니다.");
});

app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
