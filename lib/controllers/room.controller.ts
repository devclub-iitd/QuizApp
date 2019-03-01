import sequelize = require('../config/db');
import { initRoom } from '../models/room';
import { RoomModel, RoomInstance } from '../types/room';
import { QM } from './qm.controller';
import { QMInstance } from '../types/quizmaster';
import * as userController from './user.controller';
import * as resultController from './result.controller';

export const Room: RoomModel = initRoom(sequelize, QM);

export function createRoom(roomid: string,  qm: string) {
    return new Promise((resolve, reject) => {
        Room.create({
            roomid: roomid,
            qm: qm,
        }).then((room) => {
            resolve(room);
        }).catch((err) => {
            reject(err);
        });
    });
};

export function getState(roomid: string): Promise<string> {
    return new Promise((resolve, reject) => {
        Room.findByPk(roomid)
        .then((room) => {
            if(room !== null) {
                resolve(room.state);
            }
            else {
                throw 'No room with id '+roomid;
            };
        })
        .catch((err) => {
            reject(err);
        });
    });
};

export function changeState(roomid: string, state: string): Promise<{}> {
    return new Promise((resolve, reject) => {
        Room.findByPk(roomid)
        .then((room) => {
            if(room !== null) {
                return room.update({
                    state: state,
                });
            }
            else {
                throw 'No room with id '+roomid;
            };
        })
        .then(() => {
            resolve();
        })
        .catch((err) => {
            reject(err);
        });
    });
};

export function getQm(roomid: string): Promise<QMInstance> {
    return new Promise((resolve, reject) => {
        Room.findByPk(roomid)
        .then((room) => {
            if(room === null) {
                throw 'No room with id '+roomid;
            }
            else {
                return QM.findByPk(room.qm);
            };
        })
        .then((qm) => {
            if(qm !== null) {
                resolve(qm);
            };
        })
        .catch((err) => {
            reject(err);
        });
    });
};

export function getRooms(qm: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        Room.findAll({
            attributes: ['roomid'],
            where: {
                qm: qm,
            },
        })
        .then((rooms) => {
            let roomsArray: string[] = [];

            rooms.map((room, index) => {
                roomsArray[index] = room.roomid;
            });
            resolve(roomsArray);
        })
        .catch((err) => {
            reject(err);
        })
    })
};

export function purge(roomid: string): Promise<void> {
    return new Promise((resolve, reject) => {
        userController.findByRoom(roomid)
        .then((users) => {
            users.map((user) => {
                user.destroy();
            });
            return resultController.getByRoom(roomid);
        })
        .then((results) => {
            results.map((result) => {
                result.destroy();
            });
            resolve();
        })
        .catch((err) => {
            reject(err);
        });
    })
}
