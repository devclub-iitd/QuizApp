import Sequelize = require('sequelize');

export interface RoomAttributes {
    roomID: string;
    state?: Enumerator;
}

export type RoomInstance = Sequelize.Instance<RoomAttributes> & RoomAttributes;
export type RoomModel = Sequelize.Model<RoomInstance, RoomAttributes>;
