import Sequelize = require('sequelize');

export interface QuestionAttributes {
    roomid: string;
    question: JSON;
    serial: number;
}

export type QuestionInstance = Sequelize.Instance<QuestionAttributes> & QuestionAttributes;
export type QuestionModel = Sequelize.Model<QuestionInstance, QuestionAttributes>;
