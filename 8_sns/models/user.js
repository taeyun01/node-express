const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  // 모델 정보들 (테이블 이름, 컬럼 정보들 입력)
  static initiate(sequelize) {}

  // 모델 관계 설정
  static associate(db) {}
}

module.exports = User;
