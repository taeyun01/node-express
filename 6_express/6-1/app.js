const express = require("express");
const path = require("path");

const app = express();

app.set("port", process.env.PORT || 3000); // 어디서든지 app.get("port")로 접근하여 사용가능 (전역 변수같은 느낌)

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/", (req, res) => {
  res.send("Hello Express post");
});

app.get("/about", (req, res) => {
  res.send("About Express");
});

app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
