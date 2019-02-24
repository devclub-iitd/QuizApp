import sequelize = require('../config/db');
import { initQM } from '../models/quizmaster';
import { QMModel } from '../types/quizmaster';

export const QM: QMModel = initQM(sequelize);

export function createQM(username: string, email:string, phone: string,
                        password: string, socket: string) {
    return new Promise((resolve, reject) => {
        QM.create({
            username: username,
            email: email,
            phone: phone,
            password: password,
            socket: socket,
        }).then((qm) => {
            resolve(qm);
        }).catch((err) => {
            reject(err);
        });
    });
}
