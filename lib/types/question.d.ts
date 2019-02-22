import Sequelize from 'sequelize';

export interface QuestionAttributes {
    QuestionID: string;
    roomID: string;
    question: JSON;
}

export type QuestionInstance = Sequelize.Instance<QuestionAttributes> & QuestionAttributes;
export type QuestionModel = Sequelize.Model<QuestionInstance, QuestionAttributes>;
