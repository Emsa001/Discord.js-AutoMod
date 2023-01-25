const { Sequelize } = require('sequelize');

module.exports = new Sequelize('', '', '', {
    host: '',
    dialect: 'mysql',

    logging: false,
});
