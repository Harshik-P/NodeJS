const { DataTypes } = require("sequelize");

const sequelize = require("../database");
const Blogs = require("./blogs");

const User = sequelize.define("User", {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    isEmail: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Blogs);
Blogs.belongsTo(User);

module.exports = User;
