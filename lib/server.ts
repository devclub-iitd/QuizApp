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
        let message: string = '';
        if(payload.isQM) {
            qmController.createQM(payload.username, payload.email, payload.phone, payload.password, socket.id)
            .then((qm) => message = 'Success')
            .catch((err) => message = 'Failed');
        } else {
            userController.createUser(payload.user, payload.email, payload.phone, socket.id)
            .then((user) => message = 'Success')
            .catch((err) => message = 'Failed');
        };
        socket.emit('login', { message: message });
    });

    socket.on('createroom', (payload) => {
        let message = '';
        roomController.createRoom(payload.roomid, payload.qm)
        .then((room) => message = 'Success')
        .catch((err) => message = 'Failed');
        socket.emit('createroom', { message: message });
    });

    socket.on('createquestion', (payload) => {
        let message = '';
        quesController.createQuestion(payload.question, payload.roomid, payload.serial)
        .then((ques) => message = 'Success')
        .catch((err) => message = 'Failed');
        socket.emit('createquestion', { message: message });
    });

    socket.on('joinroom', (payload) => {
        let message = '';
        userController.addToRoom(payload.email, payload.roomid)
        .then((user) => message = 'Success')
        .catch((err) => message = 'Failed');
        socket.emit('joinroom', { message: message });
    });
});