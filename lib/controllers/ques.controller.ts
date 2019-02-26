import sequelize = require('../config/db');
import { initQuestion } from '../models/question';
import { QuestionModel, QuestionInstance } from '../types/question';
import { Room } from './room.controller';
import { quesArray } from '../types/quesarray';


export const Question: QuestionModel = initQuestion(sequelize, Room);

export function createQuestion(question: Text, options: JSON, roomid: string, answer: number): Promise<QuestionInstance> {
    return new Promise((resolve, reject) => {
        Question.create({
            question: question,
            options: options,
            roomid: roomid,
            answer: answer,
        })
        .then((question) => resolve(question))
        .catch((err) => reject(err));
    });
};

export function findNext(roomid: string, serial: number): Promise<QuestionInstance | null> {
    return new Promise((resolve, reject) => {
        Question.findAll({
            attributes: ['question'],
            where: {
                roomid: roomid,
            },
        })
        .then((questions) => {
            resolve(questions[serial]);
        })
        .catch((err) => reject(err));
    });
};

export function checkAnswer(roomid: string, serial: number, attempt: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
        Question.findAll({
            attributes: ['answer'],
            where: {
                roomid: roomid,
            },
        })
        .then((questions) => {
            if(questions === null) {
                throw 'No such question';
            }
            else {
                resolve(questions[serial].answer === attempt);
            };
        })
        .catch((err) => {
            reject(err);
        });
    });
};

export function getByRoom(roomid: string): Promise<quesArray> {
    return new Promise((resolve, reject) => {
        Question.findAll({
            attributes: ['question','options'],
            where: {
                roomid: roomid,
            },
        })
        .then((questions) => {
            let quesArray: quesArray = [];

            questions.map((question, index) => {
                quesArray[index] = {
                    question: question.question,
                    options: question.options,
                };
            });
            resolve(quesArray);
        })
        .catch((err) => {
            reject(err);
        });
    });
}
