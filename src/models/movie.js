module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "Movie",
        {
            Id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            Title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Description: {
                type: DataTypes.TEXT,
            },
            DurationMinutes: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            ImageUrl: {
                type: DataTypes.STRING,
            },
            Rating: {
                type: DataTypes.STRING,
            },
            CreatedAt: {
                type: DataTypes.DATE,
            },
            UpdatedAt: {
                type: DataTypes.DATE,
            },
        },
        {
            tableName: "Movies",   
            schema: "dbo",         
            timestamps: false,     
        }
    );
};
