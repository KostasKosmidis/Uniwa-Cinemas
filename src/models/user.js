module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "User",
        {
            Id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            Username: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            PasswordHash: {
                type: DataTypes.STRING(510),
                allowNull: false,
            },
            Role: {
                type: DataTypes.STRING(40),
                allowNull: false,
            },
            CreatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            UpdatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "Users",
            schema: "dbo",
            timestamps: false,
        }
    );
};
