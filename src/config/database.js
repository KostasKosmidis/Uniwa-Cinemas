const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "cinema",     // database name
  "root",       // username
  "123",   // password
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);

module.exports = sequelize;