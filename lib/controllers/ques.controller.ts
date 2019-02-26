import sequelize = require('../config/db');
import { initQuestion } from '../models/question';
import { QuestionModel, QuestionInstance } from '../types/question';
import { Room } from './room.controller';


export const Question: QuestionModel = initQuestion(sequelize, Room);

export function createQuestion(question: JSON, roomid: string, serial: number, answer: number): Promise<QuestionInstance> {
    return new Promise((resolve, reject) => {
        Question.create({
            question: question,
            roomid: roomid,
            serial: serial,
            answer: answer,
        })
        .then((question) => resolve(question))
        .catch((err) => reject(err));
    });
};

export function findNext(roomid: string, serial: number): Promise<QuestionInstance[]> {
    return new Promise((resolve, reject) => {
        Question.findAll({
            attributes: ['question'],
            where: {
                roomid: roomid,
                serial: serial,
            },
        })
        .then((question) => resolve(question))
        .catch((err) => reject(err));
    });
};

export function checkAnswer(roomid: string, serial: number, attempt: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
        Question.findOne({
            attributes: ['answer'],
            where: {
                roomid: roomid,
                serial: serial,
            },
        })
        .then((question) => {
            if(question === null) {
                throw 'No such question';
            }
            else {
                resolve(question.answer === attempt);
            };
        })
        .catch((err) => {
            reject(err);
        });
    });
}