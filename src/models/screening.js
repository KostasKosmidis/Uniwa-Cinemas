const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Screening = sequelize.define("Screening", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  return Screening;
};