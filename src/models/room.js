module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "Room",
        {
            Id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: false,
            },
            Name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Capacity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            Is3D: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            IsDolbyAtmos: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            IsIMAX: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            CreatedAt: {
                type: DataTypes.DATE,
            },
            UpdatedAt: {
                type: DataTypes.DATE,
            },
        },
        {
            tableName: "Rooms",
            schema: "dbo",
            timestamps: false,
        }
    );
};