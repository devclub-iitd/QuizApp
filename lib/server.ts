import http = require('http');
import socketio = require('socket.io');
import express = require('./config/express');
import env = require('./config/env');
import * as qmController from './controllers/qm.controller';
import * as userController from './controllers/user.controller';
import * as roomController from './controllers/room.controller';
import * as quesController from './controllers/ques.controller';

const app: Express.Application = express();
const server: http.Server = new http.Server(app);
const io = socketio(server);

server.listen(env.PORT);

io.on('connection', (socket: SocketIO.Socket) => {
    socket.on('login', (payload) => {
        if(payload.isQM) {
            qmController.createQM(payload.username, payload.email, payload.phone, payload.password, socket.id)
            .then((qm) => socket.emit('login', { message: 'Success' }))
            .catch((err) => socket.emit('login', { message: 'Failed' }));
        } else {
            userController.createUser(payload.username, payload.email, payload.phone, socket.id)
            .then((user) => socket.emit('login', { message: 'Success' }))
            .catch((err) => socket.emit('login', { message: 'Failed' }));
        };
    });

    socket.on('createroom', (payload) => {
        let message = '';
        roomController.createRoom(payload.roomid, payload.qm)
        .then((room) => socket.emit('createroom', { message: 'Success' }))
        .catch((err) => socket.emit('createroom', { message: 'Failed' }));
    });

    socket.on('createquestion', (payload) => {
        let message = '';
        quesController.createQuestion(payload.question, payload.roomid, payload.serial)
        .then((ques) => socket.emit('createquestion', { message: 'Success' }))
        .catch((err) => socket.emit('createquestion', { message: 'Failed' }));
    });

    socket.on('joinroom', (payload) => {
        let message = '';
        userController.addToRoom(payload.email, payload.roomid)
        .then((user) => socket.emit('joinroom', { message: 'Success' }))
        .catch((err) => socket.emit('joinroom', { message: 'Failed' }));
    });
});