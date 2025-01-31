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

  static associate(db) {
    db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" }); // 해시태그는 여러개의 포스트를 가질 수 있으므로 다대다 관계
    // through: "PostHashtag"에 접근하고 싶을 때 db.sequelize.models.PostHashtag
  }
}

module.exports = Hashtag;
