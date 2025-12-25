module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "Room",
        {
            Id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            Name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Capacity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            HasDolbyAtmos: {
                type: DataTypes.BOOLEAN,
            },
            Is3D: {
                type: DataTypes.BOOLEAN,
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
