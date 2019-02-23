import sequelize = require('../config/db');
import { initQuestion } from '../models/question';
import { QuestionModel } from '../types/question';
import { Room } from './room.controller';


export const Question: QuestionModel = initQuestion(sequelize, Room);

export function createQuestion(question: JSON, roomID: string, serial: number) {
    Question.create({
        question: question,
        roomID: roomID,
        serial: serial,
    }).then((question) => {
        return true;
    }).catch((err) => {
        return false;
    });
}
