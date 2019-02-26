import sequelize = require('../config/db');
import { initUser } from '../models/user';
import { UserModel, UserInstance } from '../types/user';
import { Room } from './room.controller';

export const User: UserModel = initUser(sequelize, Room);

export function createUser(username: string, email: string, phone: string,socket: string): Promise<UserInstance> {
    return new Promise((resolve, reject) => {
        User.findByPk(username)
        .then((user) => {
            if(user === null) {
                return User.create({
                    username: username,
                    email: email,
                    phone: phone,
                    socket: socket,
                });
            }
            else if(user.email!==email || user.phone!==phone) {
                throw 'Username taken. If this is a reconnect request make sure all your credentials match';
            }
            else {
                return user.update({
                    socket: socket,
                },
                {
                    where: {
                        username: username,
                    },
                });
            };
        })
        .then((user) => {
            resolve(user);
        })
        .catch((err) => {
            reject(err);
        });
    });
};

export function addToRoom(username: string, roomid: string): Promise<UserInstance> {
    return new Promise((resolve, reject) => {
        Room.findAndCountAll({
            attributes: ['roomid'],
            where: {
                roomid: roomid,
            },
        })
        .then((count) => {
            if(count.count === 1) {
                return User.findByPk(username);
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
        .then((user) => resolve(user))
        .catch((err) => reject(err))
    });
}

export function findByRoom(roomid: string): Promise<UserInstance[]> {
    return new Promise((resolve, reject) => {
        User.findAll({
            attributes: ['socket'],
            where: {
                roomid: roomid,
            },
        })
        .then((users) => resolve(users))
        .catch((err) => reject(err));
    });
}