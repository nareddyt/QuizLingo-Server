/**
 * Created by tejun on 7/8/2017.
 */

const express = require('express');
const fulfillment = require('./fulfilment.js');

const app = express();
const port = normalizePort(process.env.PORT || '8080');

app.get('/ping', function (req, res) {
    console.log(req.originalUrl + ' with payload ' + JSON.stringify(req.body) + ' and headers ' + JSON.stringify(req.headers));
    res.send('pong');
});

app.post('/fulfillment', function (req, res) {
    console.log('info', req.originalUrl + ' with payload ' + JSON.stringify(req.body) + ' and headers ' + JSON.stringify(req.headers));
    fulfillment.process(req, res);
});

app.listen(port, function () {
    console.log('Example app listening on port', port)
});

/**
 * Normalizes the port into a string or number
 */
function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}