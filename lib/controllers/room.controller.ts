import sequelize = require('../config/db');
import { initRoom } from '../models/room';
import { RoomModel } from '../types/room';
import { QM } from './qm.controller';

export const Room: RoomModel = initRoom(sequelize, QM);

export function createRoom(roomID: string,  qm: string) {
    Room.create({
        roomID: roomID,
        qm: qm,
    }).then((room) => {
        return true;
    }).catch((err) => {
        return false;
    })
}
