const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
  });

  return User;
};