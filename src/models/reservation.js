module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "Reservation",
        {
            Id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            UserId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            ScreeningId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            Seats: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            CreatedAt: {
                type: DataTypes.DATE,
            },
        },
        {
            tableName: "Reservations",
            schema: "dbo",
            timestamps: false,
        }
    );
};
