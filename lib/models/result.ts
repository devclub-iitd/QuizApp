import Sequelize = require('sequelize');
import { SequelizeAttributes } from '../types/attributes';
import { ResultInstance, ResultAttributes, ResultModel } from '../types/result';
import { RoomModel } from '../types/room';
import { UserModel } from '../types/user';

export function initResult(sequelize: Sequelize.Sequelize, Room: RoomModel, User: UserModel): ResultModel {
    const attributes: SequelizeAttributes<ResultAttributes> = {
        roomid: {
            type: Sequelize.STRING,
            references: {
                model: Room,
                key: 'roomid',
            },
            allowNull: false,
        },
        attempts: {
            type: Sequelize.JSON,
        },
        username: {
            type: Sequelize.STRING,
            references: {
                model: User,
                key: 'username',
            },
            allowNull: false,
        },
        total: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    };

    const Result = sequelize.define<ResultInstance, ResultAttributes>('result', attributes, {createdAt: false, updatedAt: false});
    return Result;
}