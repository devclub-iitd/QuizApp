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

export function addToRoom(username: string, roomid: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        User.findByPk(username)
        .then((user) => {
            if(user !== null) {
                return user.update({ roomid: roomid });
            } else {
                throw 'User not found.';
            }
        })
        .then((user) => {
            return findByRoom(roomid);
        })
        .then((users) => {
            let userArray: string[] = [];

            users.map((user, index) => {
                userArray[index] = user.username;
            });

            resolve(userArray);
        })
        .catch((err) => reject(err));
    });
}

export function findByRoom(roomid: string): Promise<UserInstance[]> {
    return new Promise((resolve, reject) => {
        User.findAll({
            attributes: ['username','socket'],
            where: {
                roomid: roomid,
            },
        })
        .then((users) => resolve(users))
        .catch((err) => reject(err));
    });
}