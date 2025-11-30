const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Movie = sequelize.define("Movie", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    duration: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING,
    rating: DataTypes.FLOAT,
  });

  return Movie;
};