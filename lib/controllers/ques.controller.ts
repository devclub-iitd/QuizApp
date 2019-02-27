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

export function findNext(roomid: string, serial: number): Promise<[QuestionInstance,boolean] | null> {
    return new Promise((resolve, reject) => {
        Question.findAll({
            attributes: ['question','options'],
            where: {
                roomid: roomid,
            },
        })
        .then((questions) => {
            if(serial === questions.length-1) {
                resolve([questions[serial], true]);
            }
            else {
                resolve([questions[serial], false]);
            };
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
            attributes: ['question','options','id'],
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
                    id: question.id,
                };
            });
            resolve(quesArray);
        })
        .catch((err) => {
            reject(err);
        });
    });
};

export function deleteQuestion(roomid: string, id: number):Promise<quesArray> {
    return new Promise((resolve, reject) => {
        Question.findAll({
            where: {
                roomid: roomid,
            },
        })
        .then((questions) => {
            questions.map((question, index) => {
                if(id === question.id){
                    questions[index].destroy();
                };
            });
            return questions;
        })
        .then((questions) => {
            questions = questions.filter((question) => {
                question.id!==id;
            });

            let quesArray: quesArray = [];
            questions.map((question, index) => {
                quesArray[index] = {
                    question: question.question,
                    options: question.options,
                    id: question.id,
                };
            });
            resolve(quesArray);
        })
        .catch((err) => {
            reject(err);
        });
    });
}
