import Sequelize = require('sequelize');
import { SequelizeAttributes } from '../types/attributes';
import { RoomAttributes, RoomInstance, RoomModel } from '../types/room';


export function initUser(sequelize: Sequelize.Sequelize):  RoomModel {
    const attributes: SequelizeAttributes<RoomAttributes> = {
        roomID: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        state: {
            type: Sequelize.ENUM,
            values: ['inactive', 'waiting', 'collecting'],
        },
    };

    const Room = sequelize.define<RoomInstance, RoomAttributes>('Rooms', attributes);
    return Room;
}