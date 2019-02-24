import Sequelize = require('sequelize');
import { SequelizeAttributes } from '../types/attributes';
import { QMAttributes, QMInstance, QMModel } from '../types/quizmaster';

export function initQM(sequelize: Sequelize.Sequelize):  QMModel {
    const attributes: SequelizeAttributes<QMAttributes> = {
        username: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true,
            },
        },
        phone: {
            type: Sequelize.JSON,
            allowNull: false,
            validate: {
                isNumeric: true,
            },
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        socket: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    };

    const Question = sequelize.define<QMInstance, QMAttributes>('qm', attributes, {createdAt: false, updatedAt: false});
    return Question;
}