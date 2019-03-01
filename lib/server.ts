import http = require('http');
import socketio = require('socket.io');
import express = require('./config/express');
import env = require('./config/env');
import * as qmController from './controllers/qm.controller';
import * as userController from './controllers/user.controller';
import * as roomController from './controllers/room.controller';
import * as quesController from './controllers/ques.controller';
import * as resultController from './controllers/result.controller';
import { UserInstance } from './types/user';


const app: Express.Application = express();
const server: http.Server = new http.Server(app);
const io = socketio(server);

server.listen(env.PORT);

const TIMER: number = 5;

function sleeper(ms: number) {
    return function(x: any) {
        return new Promise<any>(resolve => setTimeout(() => resolve(x), ms));
    };
}

io.on('connection', (socket: SocketIO.Socket) => {
    socket.on('login', (payload) => {
        console.log(payload);
        if(payload.isQM) {
            qmController.loginQM(payload.username, payload.email, payload.phone, payload.password, socket.id)
            .then((qm) => {
                return roomController.getRooms(qm.username);
            })
            .then((rooms) => {
                socket.emit('login', {
                    message: 'Success',
                    rooms: rooms,
                });
            })
            .catch((err) => {
                console.log(err);
                socket.emit('login', {
                    message: err
                });
            });
        } else {
            userController.createUser(payload.username, payload.email, payload.phone, socket.id)
            .then((user) => socket.emit('login', { message: 'Success' }))
            .catch((err) => socket.emit('login', { message: err }));
        };
    });

    socket.on('createroom', (payload) => {
        console.log(payload);
        qmController.QM.findAndCountAll({
            where: {
                socket: socket.id,
            },
        })
        .then((qms) => {
            if(qms.count === 1) {
                return;
            } else {
                throw 'Not authorised.';
            };
        })
        .then(() => {
            return roomController.createRoom(payload.roomid, payload.qm);
        })
       .then((room) => {
            return roomController.getRooms(payload.qm);
        })
        .then((rooms) => socket.emit('createroom', { 
            message: 'Success',
            rooms: rooms,
        }))
        .catch((err) => {console.log(err);socket.emit('createroom', { message: err })});
    });

    socket.on('createquestion', (payload) => {
        console.log(payload);
        qmController.authenticate(socket.id, payload.roomid)
        .then(() => {
            return quesController.createQuestion(payload.question, payload.options, payload.roomid, payload.answer);
        })
        .then((ques) => {
            return quesController.getByRoom(payload.roomid);
        })
        .then((questions) => {
            socket.emit('createquestion', {
                message: 'Success',
                questions: questions,
            });
        })
        .catch((err) => socket.emit('createquestion', { message: err }));
    });

    socket.on('deletequestion', (payload) => {
        console.log(payload);
        qmController.authenticate(socket.id, payload.roomid)
        .then(() => {
            return quesController.deleteQuestion(payload.roomid, payload.id);
        })
        .then((questions) => {
            console.log(questions);
            socket.emit('deletequestion', {
                questions: questions,
                message: 'Success',
            });
        })
        .catch((err) => {
            console.log(err);
            socket.emit('deletequestion', {
                message: 'Failed',
            });
        });
    })

    socket.on('fetchroom', (payload) => {
        console.log(payload);
        qmController.authenticate(socket.id, payload.roomid)
        .then(() => {
            return quesController.getByRoom(payload.roomid);
        })
        .then((questions) => {
            console.log(questions);
            socket.emit('fetchroom', {
                message: 'Success',
                questions: questions,
            });
        })
        .catch((err) => {
            socket.emit('fetchroom', {
                message: err,
            });
        });
    });

    socket.on('joinroom', (payload) => {
        console.log(payload);
        qmController.authenticate(socket.id, payload.roomid)
        .then(() => {
            return roomController.getState(payload.roomid);
        })
        .then((state) => {
            console.log(state);
            if(state === 'finish') {
                resultController.getLeaderboard(payload.roomid)
                .then((leaderboard) => {
                    socket.emit('joinroom', {
                        message: 'Success',
                        state: state,
                        leaderboard: leaderboard,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    socket.emit('joinroom', {
                        message: 'Failed',
                        err: err,
                    });
                });
            }
            else {
                userController.addToRoom(payload.username, payload.roomid)
                .then((users) => {
                    socket.emit('joinroom', {
                        message: 'Success',
                        state: state,
                        users: users,
                    });
                    return Promise.all([users, userController.findByRoom(payload.roomid)]);
                })
                .then(([users, usersinst]) => {

                    for(const x of usersinst) {
                        socket.broadcast.to(x.socket).emit('update', {
                            users: users,
                        }); 
                    };
                    return Promise.all([users, roomController.getQm(payload.roomid)]);
                })
                .then(([users, qm]) => {
                    socket.broadcast.to(qm.socket).emit('update', {
                        users: users,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    socket.emit('joinroom', {
                        message: 'Failed',
                        err: err,
                    });
                });
            };
        })
        .catch((err) => {
            console.log(err);
            socket.emit('joinroom', {
                message: 'Failed',
                err: err,
            });
        });
    });

    socket.on('start', (payload) => {
        console.log(payload);
        qmController.authenticate(socket.id, payload.roomid)
        .then(() => {
            return userController.findByRoom(payload.roomid);
        })
        .then((users) => {
            const startTime: number = new Date().setTime(Date.now() + 10000);

            socket.emit('start', { time: startTime });
            for(const x of users) {
                socket.broadcast.to(x.socket).emit('start', { time: startTime });
            };
            return Promise.all([users, roomController.changeState(payload.roomid, 'countdown')]);
        })
        .then(([users, {}]) => {
            return Promise.all([users, quesController.findNext(payload.roomid, 0)]);
        })
        .then(sleeper(10000))
        .then(([users, question]) => {
                if(question !== null) {
                    const endTime: number = new Date().setTime(Date.now() + TIMER*1000);
                    socket.emit('question', {
                        question: question[0].question,
                        options: question[0].options,
                        endtime: endTime,
                        totaltime: TIMER,
                        islast: question[1],
                    });
                    for(const x of users) {
                        socket.broadcast.to(x.socket).emit('question', {
                            question: question[0].question,
                            options: question[0].options,
                            endtime: endTime,
                            totaltime: TIMER,
                            islast: question[1],
                        });
                    };
                    return (roomController.changeState(payload.roomid, 'collecting'));
                } else {
                    throw('Question ID NULL! No questions in the room!');
                }
            }
        )
        .then(sleeper(TIMER*1000))
        .then(() => {
            console.log("inside timeout, setting state to waiting, room id: ",payload.roomid);
            return roomController.changeState(payload.roomid, 'waiting').catch((err)=>{
                console.log("Error: ",err);
            });
        })
        .then(() => {
            return resultController.getLeaderboard(payload.roomid);
        })
        .then((leaderboard) => {
            socket.emit('leaderboard', {
                leaderboard: leaderboard,
            });
        })
        .catch((err) => {
            console.log(err);
        });
    });

    socket.on('next', (payload) => {
        console.log(payload);
        qmController.authenticate(socket.id, payload.roomid)
        .then(() => {
            return userController.findByRoom(payload.roomid);
        })
        .then((users) => {
            return Promise.all([users, quesController.findNext(payload.roomid, payload.serial)]);
        })
        .then(([users, question]) => {
            if((question===null) || question[0]===undefined) {
                resultController.getLeaderboard(payload.roomid)
                .then((leaderboard) => {
                    socket.emit('leaderboard', {
                        message: 'Success',
                        isnotlive: true,
                        leaderboard: leaderboard
                    });
                    users.forEach((user) => {
                        socket.broadcast.to(user.socket).emit('leaderboard', {
                            leaderboard: leaderboard,
                        });
                    });
                })
                .catch((err) => console.log(err));
                return Promise.all([users,roomController.changeState(payload.roomid, 'finish')]);
            }
            else {
                const endTime: number = new Date().setTime(Date.now() + TIMER*1000);
                console.log(question);
                socket.emit('question', {
                    question: question[0].question,
                    options: question[0].options,
                    endtime: endTime,
                    totaltime: TIMER,
                    islast: question[1],
                });
                for(const x of users) {
                    console.log(x.socket, question[0].question, question[0].options);
                    socket.broadcast.to(x.socket).emit('question', {
                        question: question[0].question,
                        options: question[0].options,
                        endtime: endTime,
                        totaltime: TIMER,
                        islast: question[1],
                    });
                };
                return Promise.all([users, roomController.changeState(payload.roomid, 'collecting')]);
            };
        })
        .then(([users, x]) => {
            return Promise.all([users, roomController.getState(payload.roomid)]);
        })
        .then(sleeper(TIMER*1000))
        .then(([users,state]: [UserInstance[], string]) => {
            if(state === 'collecting') {
                roomController.changeState(payload.roomid, 'waiting')
                .then(() => {
                    return resultController.getLeaderboard(payload.roomid);
                })
                .then((leaderboard) => {
                    socket.emit('leaderboard', {
                        leaderboard: leaderboard,
                    });
                    users.forEach((user) => {
                        socket.broadcast.to(user.socket).emit('leaderboard', {
                            leaderboard: leaderboard,
                        });
                    });
                })
            };
        })
        .catch((err) => {
            console.log(err);
        });
    });

    socket.on('attempt', (payload) => {
        console.log(payload);
        resultController.addAttempt(payload.roomid, payload.username, payload.serial, payload.attempt)
        .then((result) => {})
        .catch((err) => console.log(err));
    });

    socket.on('leaderboard', (payload) => {
        resultController.getLeaderboard(payload.roomid)
        .then((leaderboard) => {
            socket.emit('leaderboard', {
                message: 'Success',
                leaderboard: leaderboard,
            });
        })
        .catch((err) => console.log(err));
    });

    socket.on('activate', (payload) => {
        console.log(payload);
        qmController.authenticate(socket.id, payload.roomid)
        .then(() => {
            return roomController.getState(payload.roomid);
        })
        .then((state):(Promise<{} | undefined> | undefined) => {
            if(state === 'finish') {
                return roomController.changeState(payload.roomid, 'inactive');
            }
        })
        .then(() => {
            return userController.findByRoom(payload.roomid);
        })
        .then((users) => {
            let userArray: string[] = [];
            users.map((user, index) => {
                userArray[index] = user.username;
            });
            return userArray;
        })
        .then((users) => {
            socket.emit('activate',{
                message: 'Success',
                users: users,
            });
        })
        .catch((err) => {
            socket.emit('activate', {
                message: err,
            });
        });
    });
});