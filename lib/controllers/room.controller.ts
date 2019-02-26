import sequelize = require('../config/db');
import { initRoom } from '../models/room';
import { RoomModel } from '../types/room';
import { QM } from './qm.controller';

export const Room: RoomModel = initRoom(sequelize, QM);

export function createRoom(roomid: string,  qm: string) {
    return new Promise((resolve, reject) => {
        Room.create({
            roomid: roomid,
            qm: qm,
        }).then((room) => {
            resolve(room);
        }).catch((err) => {
            resolve(err);
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
}
