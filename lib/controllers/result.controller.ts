import sequelize = require('../config/db');
import { initResult } from '../models/result';
import { ResultModel, ResultInstance } from '../types/result';
import { Room } from './room.controller';
import { User } from './user.controller';
import { AttemptJSON } from '../types/attempt';


export const Result: ResultModel = initResult(sequelize, Room, User);

export function createResult(roomid: string, username: string): Promise<ResultInstance> {
    return new Promise((resolve, reject) => {
        Result.create({
            roomid: roomid,
            username: username,
        })
        .then((Result) => resolve(Result))
        .catch((err) => reject(err));
    });
};

export function addAttempt(roomid: string, username: string, serial: number, attempt: number): Promise<ResultInstance> {
    return new Promise((resolve, reject) => {
        Result.findOne({
            where: {
                roomid: roomid,
                username: username,
            },
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
            if(result.attempts === null || result.attempts === undefined) {
                return result.update({
                    attempts: {
                        "1": attempt,
                    },
                });
            }
            else {
                const attempts: AttemptJSON = result.attempts;
                const sserial: string = serial.toString();
                attempts.sserial = attempt;
                return result.update({
                    attempts: attempts,
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
}