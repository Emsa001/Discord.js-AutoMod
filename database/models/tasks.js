const { DataTypes, Model } = require('sequelize');

module.exports = class config extends Model {
    static init(sequelize) {
        return super.init(
            {
                configId: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                title: { type: DataTypes.STRING },
                description: { type: DataTypes.STRING },
                points: { type: DataTypes.INTEGER, defaultValue: 1 },
            },
            {
                tableName: 'tasks',
                timestamps: true,
                sequelize,
            }
        );
    }
};
