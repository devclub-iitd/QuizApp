import Sequelize = require('sequelize');
import { SequelizeAttributes } from '../types/attributes';
import { RoomAttributes, RoomInstance, RoomModel } from '../types/room';
import { QMModel } from '../types/quizmaster';

export function initRoom(sequelize: Sequelize.Sequelize, QM: QMModel):  RoomModel {
    const attributes: SequelizeAttributes<RoomAttributes> = {
        roomid: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        state: {
            type: Sequelize.ENUM,
            values: ['inactive', 'waiting', 'collecting'],
        },
        qm: {
            type: Sequelize.STRING,
            references: {
                model: QM,
                key: 'username',
            },
            allowNull: false,
        },
    };

    const Room = sequelize.define<RoomInstance, RoomAttributes>('room', attributes, {createdAt: false, updatedAt: false});
    return Room;
}