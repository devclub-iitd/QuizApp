export = {
    user: 'CREATE TABLE IF NOT EXISTS users(username VARCHAR(128) PRIMARY_KEY NOT NULL, socket VARCHAR(256)',
    state: 'CREATE TYPE states AS ENUM (\'inactive\',\'waiting\',\'collecting\'',
    questions: 'CREATE TABLE IF NOT EXISTS questions(questionID UUID PRIMARY_KEY,question TEXT NOT NULL, option-one VARCHAR(128), option-two VARCHAR(128), option-three VARCHAR(128), option-four VARCHAR(128))',
    room: 'CREATE TABLE IF NOT EXISTS rooms(roomID VARCHAR(128) PRIMARY_KEY NOT NULL, state states, FOREIGN_KEY user REFERENCES users(username), FOREIGN_KEY questions REFERENCES questions(questionID)'
}