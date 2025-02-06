const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  // 모델 정보들 (테이블 이름, 컬럼 정보들 입력)
  static initiate(sequelize) {
    // 테이블 생성
    User.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: true, // 카카오톡 로그인은 이메일 없을 수도 있으니 비어있어도 됨으로 설정
          unique: true,
        },
        nick: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100), // 비밀번호는 암호화되서 길어지므로 100자로 설정
          allowNull: true,
        },
        provider: {
          type: Sequelize.ENUM("local", "kakao"), // ENUM을 사용해 로컬 로그인과 카카오 로그인을 구분 짓는 것
          allowNull: false,
          defaultValue: "local",
        },
        // SNS로 로그인하면 snsId를 주는데 그걸 여기다 기록 그럼 email같은 역할을 수행할 수 있음.
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true, // createdAt, updatedAt 자동 생성 (유저 생성일(회원가입)), 유저 정보 수정일)
        underscored: false, // 컬럼명을 언더스코어로 생성하지 않음
        modelName: "User", // 모델 이름 (자바스크립트에서 사용할 모델 이름)
        tableName: "users", // 테이블 이름 (db에 저장될 테이블 이름)
        paranoid: true, // deletedAt 자동 생성 (유저 삭제일), 회원탈퇴 후 탈퇴 취소 할 수도 있으니 삭제일을 기록하여 삭제 된걸로 치는거임 나중에 복구할 수 있게. soft delete 라고 함. paranoid는 soft delete를 해서 사용자를 복구도 할 수 있게 해주는 옵션.
        charset: "utf8", // 문자 인코딩 (이모티콘도 저장해야 된다면 utf8mb4로 해야함)
        collate: "utf8_general_ci", // 문자 정렬 방식 (이모티콘 허용시 utf8mb4_general_ci)
      }
    );
  }

  // 모델 관계 설정
  static associate(db) {
    db.User.hasMany(db.Post);

    db.User.belongsToMany(db.User, {
      foreignKey: "followingId",
      as: "Followers",
      through: "Follow",
    });
    db.User.belongsToMany(db.User, {
      foreignKey: "followerId",
      as: "Followings",
      through: "Follow",
    });
    db.User.hasMany(db.Domain); // 유저는 여러개의 도메인을 가질 수 있음
  }
}

module.exports = User;
