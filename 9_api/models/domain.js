const Sequelize = require("sequelize");

class Domain extends Sequelize.Model {
  static initiate(sequelize) {
    // API이용고객의 도메인을 저장하는 테이블
    Domain.init(
      {
        // 이용 고객의 도메인
        host: {
          type: Sequelize.STRING(80),
          allowNull: false,
        },
        // 이용 고객의 도메인이 무료인지 유료인지
        type: {
          type: Sequelize.ENUM("free", "premium"),
          allowNull: false,
        },
        // 키 1개 발급
        clientSecret: {
          type: Sequelize.UUID,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Domain",
        tableName: "domains",
        paranoid: true, // 복구해달라 할 수도 있으니 true
      }
    );
  }

  static associate(db) {
    db.Domain.belongsTo(db.User);
  }
}

module.exports = Domain;
