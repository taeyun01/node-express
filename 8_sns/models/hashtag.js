const Sequelize = require("sequelize");

class Hashtag extends Sequelize.Model {
  static initiate(sequelize) {
    // 해시태그는 이름만 있으면 됨
    Hashtag.init(
      {
        title: {
          type: Sequelize.STRING(15),
          allowNull: false, // 필수
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Hashtag",
        tableName: "hashtags",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {}
}

module.exports = Hashtag;
