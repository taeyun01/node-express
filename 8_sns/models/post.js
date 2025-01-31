const Sequelize = require("sequelize");

class Post extends Sequelize.Model {
  static initiate(sequelize) {
    Post.init(
      {
        content: {
          type: Sequelize.STRING(140),
          allowNull: false,
        },
        // 우선 이미지 한개만 올리는 것으로 함
        img: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Post",
        tableName: "posts",
        paranoid: false, // 게시글은 복구가 필요없으므로 false, 필요하다면 true하면 알아서 복구하게 됨
        charset: "utf8mb4", // 게시글은 이모티콘 허용
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User); // 포스트는 한 사람이 쓰는 것이므로 일대일 관계
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // 포스트는 여러개의 해시태그를 가질 수 있으므로 다대다 관계, (as, foreignKey 안 적는 이유: 테이블 이름이 달라서 헷갈릴 염려가 없음)
  }
}

module.exports = Post;
