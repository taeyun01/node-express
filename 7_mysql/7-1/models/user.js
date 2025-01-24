const Sequelize = require("sequelize");

// 시퀄라이즈로 User 모델 만들기 (mysql에서는 테이블이라고 보면됨)
class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
        // 시퀄라이즈에서는 id를 자동으로 생성해줘서 생략가능
        // id: {
        //   type: Sequelize.INTEGER,
        //   primaryKey: true,
        //   autoIncrement: true,
        // },
        name: {
          type: Sequelize.STRING(20), // mysql에서는 VARCHAR(20)
          allowNull: false, // mysql에서는 NOT NULL (필수 항목)
          unique: true, // mysql에서는 UNIQUE (고유한 키)
        },
        age: {
          type: Sequelize.INTEGER.UNSIGNED, // mysql에서는 INT
          allowNull: false,
        },
        married: {
          type: Sequelize.BOOLEAN, // mysql에서는 TINYINT
          allowNull: false,
        },
        comment: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE, // mysql에서는 DATETIME, mysql의 DATE는 시퀄에서는 DATEOnly 조금씩 차이가 있음
          allowNull: false,
          defaultValue: Sequelize.NOW, // now()
        },
      },
      {
        sequelize,
        timestamps: false, // timestamps를 true로 하면 created_at, updated_at 자동으로 생성 (이번엔 끄고 직접 구현 해보기)
        underscored: false,
        modelName: "User", // 모델 이름(자바스크립트에서 쓰는 이름)
        tableName: "users", // 테이블 이름(실제 테이블에서 쓰는 이름)
        paranoid: false, // paranoid가 true면 deleted_at(제거한 날짜) 자동으로 생성, deleted_at을 true로 해서 완전 삭제(hard delete)가 아닌 삭제한것처럼 처리(soft delete)
        charset: "utf8", // utf8mb4하면 이모티콘 사용 가능
        collate: "utf8_general_ci",
      }
    );
  }

  // 사용자는 댓글을 여러개 쓸 수 있음, 댓글을 하나의 사용자만 바라보고 있음
  // 시퀄라이즈에서는 1:N 관계를 hasMany로 표현 (사용자.hasMany(댓글))
  // 반대의 입장에는 belongsTo로 표현 (댓글.belongsTo(사용자))
  // db.User.hasMany(유저가 많이 갖고 있다) 뭐를? db.Comment 댓글을
  static associate(db) {
    db.User.hasMany(db.Comment, { foreignKey: "commenter", sourceKey: "id" });
    // foreignKey: 외래키 (내가 아닌 남) 남이면 Comment다. 유저 입장에서 foreignKey는 Comment
    // sourceKey: 외래키가 참조하는 컬럼 (나)
    // 즉, Comment에 commenter라는 컬럼이 내 id를 참조하고 있다. (내 id(sourceKey)를 남의 foreignKey(commenter)가 참조하고 있다.)
  }
}

module.exports = User;
