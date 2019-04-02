import db = require('../config/db');
import { initUser } from '../models/user';
import { UserModel, UserInstance } from '../types/user';
import { Room } from './room.controller';

const sequelize = db.sequelize;
export const User: UserModel = initUser(sequelize, Room);

export function createUser(username: string, email: string, phone: string,socket: string): Promise<UserInstance> {
    console.log('Creating user...');
    return new Promise((resolve, reject) => {
        console.log('Checking for duplication.');
        User.findByPk(username)
        .then((user) => {
            if(user === null) {
                console.log('Creating new user...');
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
                console.log('Reconnecting user...');
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
            console.log('User logged in.');
            resolve(user);
        })
        .catch((err) => {
            reject(err);
        });
    });
};

export function addToRoom(username: string, roomid: string): Promise<string[]> {
    console.log('Adding user to room...');
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
    console.log('Finding users list for room');
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