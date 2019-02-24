import http = require('http');
import socketio = require('socket.io');
import express = require('./config/express');
import env = require('./config/env');
import { createQM } from './controllers/qm.controller';
import { createUser } from './controllers/user.controller';
import { createRoom } from './controllers/room.controller';

const app: Express.Application = express();
const server: http.Server = new http.Server(app);
const io = socketio(server);

server.listen(env.PORT);

io.on('connection', (socket: SocketIO.Socket) => {
    socket.on('login', (payload) => {
        let message: string = '';
        if(payload.isQM) {
            createQM(payload.username, payload.email, payload.phone, payload.password, socket.id)
            .then((qm) => message = 'Success')
            .catch((err) => message = 'Failed');
        } else {
            createUser(payload.user, payload.email, payload.phone, socket.id)
            .then((user) => message = 'Success')
            .catch((err) => message = 'Failed');
        };
        socket.emit('login', { message: message });
    });
});