import http = require('http');
import socketio = require('socket.io');
import express = require('./config/express');
import env = require('./config/env');
import user = require('./models/user');

const app: Express.Application = express();
const server: http.Server = http.createServer(app);
const io = socketio(server);

server.listen(env.PORT);
