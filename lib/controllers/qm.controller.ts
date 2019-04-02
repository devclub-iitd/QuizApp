import db = require('../config/db');
import { initQM } from '../models/quizmaster';
import { QMModel, QMInstance } from '../types/quizmaster';
import * as roomController from '../controllers/room.controller';

const sequelize = db.sequelize;
export const QM: QMModel = initQM(sequelize);

export function loginQM(username: string,email:string,phone: string,password: string,socket: string): Promise<QMInstance>{
    // return new Promise((resolve, reject) => {
    //     QM.findByPk(username)
    //     .then((qm) => {
    //         if((qm) === null) {
    //             throw 'FATAL. Wrong Credentials.'
    //         }
    //         else if(qm.email===email && qm.phone===phone && qm.password===password) {
    //             return resolve(qm.update({
    //                 socket: socket,
    //             }));
    //         }
    //         else {
    //             throw 'FATAL. Credentials do not match.'
    //         };
    //     }).catch((err) => {
    //         reject(err);
    //     });
    // });
    console.log('QM login');
    const p = QM.findByPk(username)
    .then((qm) => {
        if((qm) === null) {
            throw 'FATAL. Wrong Credentials.'
        }
        else if(qm.email===email && qm.phone===phone && qm.password===password) {
            return qm.update({
                socket: socket,
            });
        }
        else {
            throw 'FATAL. Credentials do not match.'
        };
    });
    return Promise.resolve(p);
}

export function authenticate(socketid: string, roomid: string): Promise<void> {
    console.log('Authenticating QM');
    return new Promise((resolve, reject) => {
        QM.findAndCountAll({
            where: {
                socket: socketid,
            },
        })
        .then((qms) => {
            if(qms.count === 1) {
                return Promise.all([qms.rows[0], roomController.getQm(roomid)]);
            } else {
                throw 'Not authorised.';
            };
        })
        .then(([qm1,qm2]) => {
            if(qm1.username === qm2.username) {
                console.log('Authenticated');
                resolve();
            } else {
                throw 'This qm has no control over this room.'
            };
        })
        .catch((err) => {
            reject(err);
        })
    });
}
