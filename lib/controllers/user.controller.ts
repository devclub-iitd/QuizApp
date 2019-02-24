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
};

export function addToRoom(email: string, roomid: string) {
    return new Promise((resolve, reject) => {
        Room.findAndCountAll({attributes: ['roomid'], where: {roomid: roomid}})
        .then((count) => {
            if(count.count === 1) {
                return User.findByPk(email);
            }
            else {
                throw ('No room with id '+roomid);
            }
        })
        .then((user) => {
            if(user !== null) {
                return user.update({ roomid: roomid });
            } else {
                throw 'user not found';
            }
        })
        .then((user) => {
            resolve(user);
        })
        .catch((err) => {
            reject(err);
        });
    });
}