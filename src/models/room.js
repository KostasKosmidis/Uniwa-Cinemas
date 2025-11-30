const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Room = sequelize.define("Room", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    is3D: { type: DataTypes.BOOLEAN, defaultValue: false },
    isDolbyAtmos: { type: DataTypes.BOOLEAN, defaultValue: false },
  });

  return Room;
};