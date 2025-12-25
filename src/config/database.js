const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,     // Uniwa Cinemas
    process.env.DB_USER,     // sa
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST, // localhost
        port: process.env.DB_PORT || 1433,
        dialect: "mssql",
        dialectOptions: {
            options: {
                encrypt: false,
                trustServerCertificate: true,
            },
        },
        logging: false,
    }
);

module.exports = sequelize;
