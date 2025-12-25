module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "Screening",
        {
            Id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            MovieId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            RoomId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            StartTime: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            Price: {
                type: DataTypes.DECIMAL(6, 2),
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
            tableName: "Screenings",
            schema: "dbo",
            timestamps: false,
        }
    );
};
