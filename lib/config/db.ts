import Sequelize = require('sequelize');
import env = require('./env');

const sequelize: Sequelize.Sequelize = new Sequelize(env.DATABASE_URL,{
    dialect: 'postgres',
});

export = sequelize;