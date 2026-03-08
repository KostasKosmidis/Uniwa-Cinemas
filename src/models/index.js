const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Movie = require("./movie")(sequelize, Sequelize.DataTypes);
const Room = require("./room")(sequelize, Sequelize.DataTypes);
const Screening = require("./screening")(sequelize, Sequelize.DataTypes);
const Reservation = require("./reservation")(sequelize, Sequelize.DataTypes);
const User = require("./user")(sequelize, Sequelize.DataTypes);


Movie.hasMany(Screening, { foreignKey: "MovieId" });
Screening.belongsTo(Movie, { foreignKey: "MovieId" });

Room.hasMany(Screening, { foreignKey: "RoomId" });
Screening.belongsTo(Room, { foreignKey: "RoomId" });

User.hasMany(Reservation, { foreignKey: "UserId" });
Reservation.belongsTo(User, { foreignKey: "UserId" });

Screening.hasMany(Reservation, { foreignKey: "ScreeningId" });
Reservation.belongsTo(Screening, { foreignKey: "ScreeningId" });

module.exports = {
    sequelize,
    Movie,
    Room,
    Screening,
    Reservation,
    User,
};
