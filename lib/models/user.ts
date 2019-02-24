import Sequelize = require('sequelize');
import { SequelizeAttributes } from '../types/attributes';
import { UserAttributes, UserInstance, UserModel } from '../types/user';
import { RoomModel } from '../types/room';
import { Socket } from 'dgram';
import { isNumber } from 'util';

export function initUser(sequelize: Sequelize.Sequelize, Room: RoomModel): UserModel {
    const attributes: SequelizeAttributes<UserAttributes> = {
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true,
            },
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isNumeric: true,
            },
        },
        roomid: {
            type: Sequelize.STRING,
            references: {
                model: Room,
                key: 'roomid',
            }
        },
        socket: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    };

    const User = sequelize.define<UserInstance, UserAttributes>('user', attributes, {createdAt: false, updatedAt: false});
    return User;
}