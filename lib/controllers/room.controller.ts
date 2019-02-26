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
}
