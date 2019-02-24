import sequelize = require('../config/db');
import { initQuestion } from '../models/question';
import { QuestionModel } from '../types/question';
import { Room } from './room.controller';


export const Question: QuestionModel = initQuestion(sequelize, Room);

export function createQuestion(question: JSON, roomid: string, serial: number) {
    return new Promise((resolve, reject) => {
        Question.create({
            question: question,
            roomid: roomid,
            serial: serial,
        }).then((question) => {
            resolve(question);
        }).catch((err) => {
            reject(err);
        });
    });
}
