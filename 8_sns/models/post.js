const Sequelize = require("sequelize");

class Post extends Sequelize.Model {
  static initiate(sequelize) {}

  static associate(db) {}
}

module.exports = Post;
