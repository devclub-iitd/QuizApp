import Sequelize = require('sequelize');

export interface UserAttributes {
    username: string;
    email: string;
    phone: string;
    qm: boolean;
    room?: string;
}

export type UserInstance = Sequelize.Instance<UserAttributes> & UserAttributes;
export type UserModel = Sequelize.Model<UserInstance, UserAttributes>;
