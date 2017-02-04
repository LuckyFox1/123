'use strict';

const express = require('express'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser');

const config = require('./config'),
    routes = require('./routes');

const app = express();

require('./db');

app.set('views', __dirname);
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public/')));

app.use('/', routes);

http.createServer(app).listen(config.port, function (req, res) {
    console.log('Express server listening on port ' + config.port);
});

app.use((req, res, next) => {
    const err = new Error(`Not Found ${req.path}`);
    err.status = 404;
    next(err);
});

app.use((error, req, res, next) => {
    if (error) {
        console.log(error);
        return res.status(400).json({error});
    }
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
