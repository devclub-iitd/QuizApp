import Sequelize = require('sequelize');

export interface UserAttributes {
    username: string;
    email: string;
    phone: string;
    room?: string;
    socket: string;
}

export type UserInstance = Sequelize.Instance<UserAttributes> & UserAttributes;
export type UserModel = Sequelize.Model<UserInstance, UserAttributes>;
