const initQueries: string[] = [
    'CREATE TABLE IF NOT EXISTS qms(username VARCHAR PRIMARY KEY, email VARCHAR, phone VARCHAR, password VARCHAR, socket VARCHAR);',
    'CREATE TABLE IF NOT EXISTS rooms(roomid VARCHAR PRIMARY KEY, qm VARCHAR, state VARCHAR, FOREIGN KEY(qm) REFERENCES qms(username));',
    'CREATE TABLE IF NOT EXISTS users(username VARCHAR PRIMARY KEY, email VARCHAR, phone VARCHAR, roomid VARCHAR, socket VARCHAR, FOREIGN KEY(roomid) REFERENCES rooms(roomid));',
    'CREATE TABLE IF NOT EXISTS questions(id SERIAL PRIMARY KEY, roomid VARCHAR, question TEXT, options JSON, answer INTEGER, FOREIGN KEY(roomid) REFERENCES rooms(roomid));',
    'CREATE TABLE IF NOT EXISTS results(id SERIAL PRIMARY KEY, username VARCHAR, roomid VARCHAR, attempts JSON, total INTEGER, FOREIGN KEY(username) REFERENCES users(username), FOREIGN KEY(roomid) REFERENCES rooms(roomid));',
]

export = initQueries;