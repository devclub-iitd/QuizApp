import sequelize = require('../config/db');
import { initQM } from '../models/quizmaster';
import { QMModel, QMInstance } from '../types/quizmaster';

export const QM: QMModel = initQM(sequelize);

export function loginQM(username: string,email:string,phone: string,password: string,socket: string): Promise<QMInstance>{
    return new Promise((resolve, reject) => {
        QM.findByPk(username)
        .then((qm) => {
            if((qm) === null) {
                throw 'FATAL. Wrong Credentials.'
            }
            else if(qm.email===email && qm.phone===phone && qm.password===password) {
                qm.update({
                    attributes: {
                        socket: socket,
                    },
                })
                .then((qm) => {
                    resolve(qm);
                })
                .catch((err) => {
                    reject(err);
                });
            }
            else {
                throw 'FATAL. Credentials do not match.'
            };
        }).catch((err) => {
            reject(err);
        });
    });
}
