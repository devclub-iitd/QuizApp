import Sequelize from 'sequelize';
import db from '../config/db';
import { SequelizeAttributes } from '.././types/index';
import { UserAttributes, UserInstance, UserModel } from '../types/user';

export function initUser(sequelize: Sequelize.Sequelize): UserModel {
    const attributes: SequelizeAttributes<UserAttributes> = {
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false
        },
        qm: {
            type: Sequelize.BOOLEAN
        },
    };

    const User = sequelize.define<UserInstance, UserAttributes>('Users', attributes);
    return User;
}