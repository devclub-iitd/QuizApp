import http = require('http');
import socketio = require('socket.io');
import express = require('./config/express');
import env = require('./config/env');
import * as qmController from './controllers/qm.controller';
import * as userController from './controllers/user.controller';
import * as roomController from './controllers/room.controller';
import * as quesController from './controllers/ques.controller';
import * as resultController from './controllers/result.controller';

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
        roomController.createRoom(payload.roomid, payload.qm)
        .then((room) => socket.emit('createroom', { message: 'Success' }))
        .catch((err) => socket.emit('createroom', { message: 'Failed' }));
    });

    socket.on('createquestion', (payload) => {
        quesController.createQuestion(payload.question, payload.roomid, payload.serial, payload.answer)
        .then((ques) => socket.emit('createquestion', { message: 'Success' }))
        .catch((err) => socket.emit('createquestion', { message: 'Failed' }));
    });

    socket.on('joinroom', (payload) => {
        userController.addToRoom(payload.email, payload.roomid)
        .then((user) => socket.emit('joinroom', { message: 'Success' }))
        .catch((err) => socket.emit('joinroom', { message: 'Failed' }));
    });

    socket.on('start', (payload) => {
        userController.findByRoom(payload.roomid)
        .then((users) => {
            const startTime: number = new Date().setTime(Date.now() + 10000);
            for(const x of users) {
                socket.broadcast.to(x.socket).emit('start', { time: startTime });                
            };
            return Promise.all([users, quesController.findNext(payload.roomid, 1)]);
        })
        .then(([users, question]) => {
            setTimeout(function() {
                socket.emit('question', { question: question[0].question });
                for(const x of users) {
                    socket.broadcast.to(x.socket).emit('question', { question: question });
                }
            }, 10000);
        })
        .catch((err) => {
            console.log(err);
        });
    });

    socket.on('next', (payload) => {
        userController.findByRoom(payload.roomid)
        .then((users) => {
            return Promise.all([users, quesController.findNext(payload.roomid, payload.serial)]);
        })
        .then(([users, question]) => {
            socket.emit('question', { question: question[0].question });
            for(const x of users) {
                socket.broadcast.to(x.socket).emit('question', { question: question });
            }
        })
        .catch((err) => {
            console.log(err);
        });
    });

    socket.on('attempt', (payload) => {
        resultController.addAttempt(payload.roomid, payload.username, payload.serial, payload.attempt)
        .then((result) => {})
        .catch((err) => console.log(err));
    });
});