import Sequelize = require('sequelize');

export interface QuestionAttributes {
    id?: number,
    roomid: string;
    question: Text;
    options: JSON;
    answer: number;
}

export type QuestionInstance = Sequelize.Instance<QuestionAttributes> & QuestionAttributes;
export type QuestionModel = Sequelize.Model<QuestionInstance, QuestionAttributes>;
