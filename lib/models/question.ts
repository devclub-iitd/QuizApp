import Sequelize = require('sequelize');
import { SequelizeAttributes } from '../types/attributes';
import { QuestionAttributes, QuestionInstance, QuestionModel } from '../types/question';
import { RoomModel } from '../types/room';

export function initQuestion(sequelize: Sequelize.Sequelize, Room: RoomModel):  QuestionModel {
    const attributes: SequelizeAttributes<QuestionAttributes> = {
        QuestionID: {
            type: Sequelize.STRING,
            primaryKey: true
        },
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
        }
    };

    const Question = sequelize.define<QuestionInstance, QuestionAttributes>('Questions', attributes);
    return Question;
}