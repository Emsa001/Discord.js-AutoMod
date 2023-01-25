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
                userId: { type: DataTypes.STRING },
                application: { type: DataTypes.STRING },
                status: { type: DataTypes.STRING },
            },
            {
                tableName: 'application',
                timestamps: true,
                sequelize,
            }
        );
    }
};
