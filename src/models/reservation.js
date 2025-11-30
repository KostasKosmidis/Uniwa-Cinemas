const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Reservation = sequelize.define("Reservation", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    seats: DataTypes.INTEGER,
  });

  return Reservation;
};