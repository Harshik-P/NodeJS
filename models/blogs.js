const { DataTypes } = require("sequelize");

const sequelize = require("../database");

const Blogs = sequelize.define("Blogs", {
  blogId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  createdByUser: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Blogs;
