const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { afterUploadImage, uploadPost } = require("../controllers/post");

// uploads 폴더가 없으면 생성 (사용자들이 등록한 이미지들을 저장하는 폴더)
try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

const uploadImage = multer({
  // 파일 저장 경로는 디스크에 저장
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/"); // uploads 폴더에 저장
    },
    // 파일 이름 설정
    filename(req, file, cb) {
      console.log("파일 정보!!", file); // 파일 정보
      const ext = path.extname(file.originalname); // 파일 확장자 추출 ex) .png, .jpg ...
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext); // 이미지.png -> 이미지123123123.png 중복 이름 방지, 같으면 덮어씌어짐
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB 제한
});

// 이미지 업로드, 게시글 작성은 로그인 해야만 쓸 수 있음
// 프론트에서 로그인해야지만 보이니까 서버에서 처리 안해도 되지 않냐 라고 할 수 있지만, postman같은 도구로 요청을 보낼수도 있음
router.post("/img", isLoggedIn, uploadImage.single("img"), afterUploadImage); // "img"는 프론트에서 보내는 formData

const uploadWriting = multer();
router.post("/", isLoggedIn, uploadWriting.none(), uploadPost); // 게시글 등록시에는 이미지 업로드 안함

module.exports = router;
