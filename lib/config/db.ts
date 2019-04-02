import Sequelize = require('sequelize');
import env = require('./env');
import initQueries = require('./tables');

export const sequelize: Sequelize.Sequelize = new Sequelize(env.DATABASE_URL,{
    dialect: 'postgres',
});

export async function initdb() {
    for(let i=0; i<initQueries.length; i++) {
        await sequelize.query(initQueries[i]);
    }
};
