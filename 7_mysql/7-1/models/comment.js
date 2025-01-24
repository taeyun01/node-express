const Sequelize = require("sequelize");

// 시퀄라이즈로 Comment 모델 만들기
class Comment extends Sequelize.Model {
  static initiate(sequelize) {
    Comment.init(
      {
        // commenter가 없는데 이건 시퀄라이즈에서 관계 컬럼이라고 해서 특별히 따로 컬럼을 만들어줘야함
        comment: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: false,
        modelName: "Comment",
        tableName: "comments",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Comment.belongsTo(db.User, { foreignKey: "commenter", targetKey: "id" });
    // db.Comment.belongsTo = 댓글은 속해있다 어디에?? db.User = 사용자에 속해있다.
    // belongsTo일 때는 sourceKey가 아닌 targetKey다. 유저의 타겟(id)을 지정
  }
}

module.exports = Comment;
