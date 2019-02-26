import Sequelize = require('sequelize');

export interface QuestionAttributes {
    roomid: string;
    serial: number;
    question: Text;
    options: JSON;
    answer: number;
}

export type QuestionInstance = Sequelize.Instance<QuestionAttributes> & QuestionAttributes;
export type QuestionModel = Sequelize.Model<QuestionInstance, QuestionAttributes>;
