import Sequelize = require('sequelize');
import uuid = require('uuid/v4');
import { SequelizeAttributes } from '../types/attributes';
import { QuestionAttributes, QuestionInstance, QuestionModel } from '../types/question';
import { RoomModel } from '../types/room';

export function initQuestion(sequelize: Sequelize.Sequelize, Room: RoomModel):  QuestionModel {
    const attributes: SequelizeAttributes<QuestionAttributes> = {
        roomID: {
            type: Sequelize.STRING,
            references: {
                model: Room,
                key: 'roomID',
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
    };

    const Question = sequelize.define<QuestionInstance, QuestionAttributes>('Questions', attributes);
    return Question;
}