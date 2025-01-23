const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");

dotenv.config(); // 환경변수 파일 불러오기.

const app = express();
app.set("port", process.env.PORT || 3000);

// use는 모든 라우터에 적용되는 것들
app.use(morgan("dev"));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "session-cookie",
  })
);
app.use("/", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const multer = require("multer");
const fs = require("fs");

//* multer 데이터 형싱
//* from 태그의 enctype="multipart/form-data" 일때 사용 (<form action="/upload" method="post" enctype="multipart/form-data"><input type="file" name="image" /><input type="text" name="title" /><button type="submit">업로드</button></form>)
//* body-parser로는 요청 본문을 해석할 수 없음 (multer패키지 필요)
try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}
// 업로드 multer 설정
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      // 어디에 저장할지
      done(null, "uploads/"); // 저장할 경로 (uploads폴더가 없으면 만들어주기)
    },
    filename(req, file, done) {
      // 파일 이름을 결정하는 함수
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한 (현재 5MB이하 파일만 업로드 설정)
});
app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "multipart.html"));
});
// 업로드 라우터 upload.single은 한개의 파일만 업로드 가능. "image"는 폼에서 보낸 name 이름과 같아야함
// upload.array는 여러개의 파일을 업로드 가능. req.files에 들어있음
app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file); // 업로드한 정보는 req.file에 들어있음
  res.send("ok");
});

app.post(
  "/upload",
  upload.fields([{ name: "image1", limits: 5 }, { name: "image2" }]),
  (req, res) => {
    console.log(req.files.image1); // 업로드한 정보는 req.files.image1에 들어있음
    console.log(req.files.image2); // 업로드한 정보는 req.files.image2에 들어있음
    res.send("ok");
  }
);

// 이미지를 업로드 하지 않는 경우
app.post("/upload", upload.none(), (req, res) => {
  res.send("ok");
});

app.get(
  "/",
  (req, res, next) => {
    console.log("GET / 요청에서만 실행됩니다.");
    next();
  },
  (req, res) => {
    throw new Error("에러는 에러 처리 미들웨어로 갑니다.");
  }
);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
