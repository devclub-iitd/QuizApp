import Sequelize = require('sequelize');

export interface ResultAttributes {
    roomid: string;
    attempts: JSON;
    username: string;
}

export type ResultInstance = Sequelize.Instance<ResultAttributes> & ResultAttributes;
export type ResultModel = Sequelize.Model<ResultInstance, ResultAttributes>;
