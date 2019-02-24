import sequelize = require('../config/db');
import { initUser } from '../models/user';
import { UserModel } from '../types/user';
import { Room } from './room.controller';

export const User: UserModel = initUser(sequelize, Room);

export function createUser(username: string, email: string, phone: string,socket: string) {
    return new Promise((resolve, reject) => {
        User.create({
            username: username,
            email: email,
            phone: phone,
            socket: socket,
        }).then((user) => {
            resolve(user);
        }).catch((err) => {
            reject(err);
        });
    });
}