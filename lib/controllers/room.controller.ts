import sequelize = require('../config/db');
import { initRoom } from '../models/room';
import { RoomModel } from '../types/room';
import { QM } from './qm.controller';

export const Room: RoomModel = initRoom(sequelize, QM);

export function createRoom(roomID: string,  qm: string) {
    return new Promise((resolve, reject) => {
        Room.create({
            roomID: roomID,
            qm: qm,
        }).then((room) => {
            resolve(room);
        }).catch((err) => {
            resolve(err);
        });
    });
}
