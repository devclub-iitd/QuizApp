import Sequelize = require('sequelize');
import { AttemptJSON } from './attempt';

export interface ResultAttributes {
    roomid: string;
    attempts?: AttemptJSON;
    username: string;
    total: number;
}

export type ResultInstance = Sequelize.Instance<ResultAttributes> & ResultAttributes;
export type ResultModel = Sequelize.Model<ResultInstance, ResultAttributes>;
