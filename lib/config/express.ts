import express = require('express');
import bodyParser = require('body-parser');
import env = require('./env');

function init() {
    const app: express.Application = express();
    
    app.set('port', env.PORT);

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());
    app.use(express.static('./build'))

    app.get('/', (req, res) => {
        res.sendFile('./build/index.html');
    });
    return app;
}

export = init;