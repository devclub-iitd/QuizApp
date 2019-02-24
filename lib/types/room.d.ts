import Sequelize = require('sequelize');

export interface RoomAttributes {
    roomid: string;
    state?: Enumerator;
    qm: string;
}

export type RoomInstance = Sequelize.Instance<RoomAttributes> & RoomAttributes;
export type RoomModel = Sequelize.Model<RoomInstance, RoomAttributes>;
