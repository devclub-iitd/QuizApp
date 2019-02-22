import Sequelize = require('sequelize');

export interface QMAttributes {
    username: string;
    email: string;
    phone: string;
    password: string;
}

export type QMInstance = Sequelize.Instance<QMAttributes> & QMAttributes;
export type QMModel = Sequelize.Model<QMInstance, QMAttributes>;
