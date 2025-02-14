const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const db = {};
// 데이터베이스 연결을 하는게 아닌 연결 하기위해 만들어 놓는 것
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

const basename = path.basename(__filename); // 현재 파일 이름 index.js

fs.readdirSync(__dirname) // 현재 폴더(models)의 모든 파일을 조회
  .filter((file) => {
    // 모델이 아닌 파일이 들어가지 안게끔 필터링
    // 숨김 파일(.env같은), index.js, js 확장자가 아닌 파일 필터링 (index.js는 모델이 아니므로 제외)
    return (
      file.indexOf(".") !== 0 &&
      !file.includes("test") &&
      file !== basename &&
      file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    // 해당 파일의 모델 불러와서 init
    const model = require(path.join(__dirname, file)); // models 폴더 내의 파일들을 불러옴, 필터된 애들 빼고
    console.log(file, model.name);
    db[model.name] = model;
    model.initiate(sequelize); // 모델 파일들을 초기화
  });

Object.keys(db).forEach((modelName) => {
  console.log(db, modelName);
  // associate 호출
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
