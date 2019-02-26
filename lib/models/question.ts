import Sequelize = require('sequelize');
import { SequelizeAttributes } from '../types/attributes';
import { QuestionAttributes, QuestionInstance, QuestionModel } from '../types/question';
import { RoomModel } from '../types/room';

export function initQuestion(sequelize: Sequelize.Sequelize, Room: RoomModel):  QuestionModel {
    const attributes: SequelizeAttributes<QuestionAttributes> = {
        roomid: {
            type: Sequelize.STRING,
            references: {
                model: Room,
                key: 'roomid',
            },
            allowNull: false,
        },
        question: {
            type: Sequelize.JSON,
            allowNull: false,
        },
        serial: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        answer: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    };

    const Question = sequelize.define<QuestionInstance, QuestionAttributes>('question', attributes, {createdAt: false, updatedAt: false});
    return Question;
}