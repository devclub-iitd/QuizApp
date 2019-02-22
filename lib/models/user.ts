import Sequelize = require('sequelize');
import { SequelizeAttributes } from '../types/attributes';
import { UserAttributes, UserInstance, UserModel } from '../types/user';
import { RoomModel } from '../types/room';

export function initUser(sequelize: Sequelize.Sequelize, Room: RoomModel): UserModel {
    const attributes: SequelizeAttributes<UserAttributes> = {
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                isEmail: true,
            },
            primaryKey: true
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false
        },
        roomID: {
            type: Sequelize.STRING,
            references: {
                model: Room,
                key: 'roomID',
            }
        }
    };

    const User = sequelize.define<UserInstance, UserAttributes>('Users', attributes);
    return User;
}