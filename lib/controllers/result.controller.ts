import sequelize = require('../config/db');
import { initResult } from '../models/result';
import { ResultModel, ResultInstance } from '../types/result';
import { Room, getState } from './room.controller';
import { User } from './user.controller';
import { checkAnswer } from './ques.controller';
import { AttemptJSON } from '../types/attempt';
import { Leaderboard } from '../types/leaderboard';

export const Result: ResultModel = initResult(sequelize, Room, User);

export function createResult(roomid: string, username: string): Promise<ResultInstance> {
    return new Promise((resolve, reject) => {
        Result.create({
            roomid: roomid,
            username: username,
            total: 0,
        })
        .then((Result) => resolve(Result))
        .catch((err) => reject(err));
    });
};

export function addAttempt(roomid: string, username: string, serial: number, attempt: number): Promise<ResultInstance> {
    return new Promise((resolve, reject) => {
        getState(roomid)
        .then((state) => {
            if(state === 'collecting') {
                return Result.findOne({
                    where: {
                        roomid: roomid,
                        username: username,
                    },
                });
            }
            else {
                throw 'Not collecting answers';
            };
        })
        .then((result) => {
            if(result === null) {
                return createResult(roomid, username);
            }
            else {
                return result;
            }
        })
        .then((result) => {
            return Promise.all([result, checkAnswer(roomid, serial, attempt)]);
        })
        .then(([result, correct]) => {
            let total = result.total;
            if(correct) total++;
    
            if(result.attempts === null || result.attempts === undefined) {
                
                return result.update({
                    attempts: {
                        "1": attempt,
                    },
                    total: total,    
                });
            }
            else {
                const attempts: AttemptJSON = result.attempts;
                const sserial: string = serial.toString();
                attempts[sserial] = attempt;
                
                return result.update({
                    attempts: attempts,
                    total: total,
                });
            };
        })
        .then((result) => {
            resolve(result);
        })
        .catch((err) => {
            reject(err)
        });
    });
};

export function getLeaderboard(roomid: string): Promise<Leaderboard> {
    return new Promise((resolve, reject) => {
        Result.findAll({
            attributes: ['username', 'total'],
            where: {
                roomid: roomid,
            },
        })
        .then((results) => {
            let resultArray: Leaderboard = [];

            results.map((result, index) => {
                resultArray[index] = {
                    username: result.username,
                    total: result.total,
                };
            });

            resultArray.sort((a, b) => {
                if(a.total > b.total) {
                    return -1;
                }
                else if (a.total < b.total) {
                    return 1;
                }
                else {
                    return 0;
                }
            });

            resolve(resultArray);
        })
        .catch((err) => {
            reject(err);
        });
    });
}