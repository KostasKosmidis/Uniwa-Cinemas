const sequelize = require("../config/database");

const Movie = require("./movie")(sequelize);
const Room = require("./room")(sequelize);
const Screening = require("./screening")(sequelize);
const Reservation = require("./reservation")(sequelize);
const User = require("./user")(sequelize);

// RELATIONS
Movie.hasMany(Screening, { foreignKey: "movieId" });
Screening.belongsTo(Movie, { foreignKey: "movieId" });

Room.hasMany(Screening, { foreignKey: "roomId" });
Screening.belongsTo(Room, { foreignKey: "roomId" });

User.hasMany(Reservation, { foreignKey: "userId" });
Reservation.belongsTo(User, { foreignKey: "userId" });

Screening.hasMany(Reservation, { foreignKey: "screeningId" });
Reservation.belongsTo(Screening, { foreignKey: "screeningId" });

module.exports = {
  sequelize,
  Movie,
  Room,
  Screening,
  Reservation,
  User,
};