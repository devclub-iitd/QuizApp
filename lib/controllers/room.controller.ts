import db = require('../config/db');
import { initRoom } from '../models/room';
import { RoomModel, RoomInstance } from '../types/room';
import { QM } from './qm.controller';
import { QMInstance } from '../types/quizmaster';
import * as userController from './user.controller';
import * as resultController from './result.controller';

const sequelize = db.sequelize;
export const Room: RoomModel = initRoom(sequelize, QM);

export function createRoom(roomid: string,  qm: string) {
    console.log('Creating room', roomid);
    return new Promise((resolve, reject) => {
        Room.create({
            roomid: roomid,
            qm: qm,
        }).then((room) => {
            console.log('Created room.')
            resolve(room);
        }).catch((err) => {
            reject(err);
        });
    });
};

export function getState(roomid: string): Promise<string> {
    console.log('Fetching state of room', roomid);
    return new Promise((resolve, reject) => {
        Room.findByPk(roomid)
        .then((room) => {
            if(room !== null) {
                console.log('Fetched state:', room.state);
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
    console.log('Changing state of room '+roomid+' to '+state);
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
            console.log('Changed state of room', roomid);
            resolve();
        })
        .catch((err) => {
            reject(err);
        });
    });
};

export function getQm(roomid: string): Promise<QMInstance> {
    console.log('Getting QM for room', roomid);
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
                console.log('Found QM for room', roomid);
                resolve(qm);
            };
        })
        .catch((err) => {
            reject(err);
        });
    });
};

export function getRooms(qm: string): Promise<string[]> {
    console.log('Getting list of rooms for qm', qm);
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
            console.log('Got list of rooms.');
            resolve(roomsArray);
        })
        .catch((err) => {
            reject(err);
        })
    })
};

export function purge(roomid: string): Promise<void> {
    console.log('Purging data of room', roomid);
    return new Promise((resolve, reject) => {
        resultController.getByRoom(roomid)
        .then((results) => {
            console.log('Purging results...');
            results.map((result) => {
                result.destroy();
            });
            return userController.findByRoom(roomid);
        })
        .then((users) => {
            console.log('Purging users...');
            users.map((users) => {
                users.destroy();
            });
            console.log('Purging complete.')
            resolve();
        })
        .catch((err) => {
            reject(err);
        });
    })
}
