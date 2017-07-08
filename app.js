/**
 * Created by tejun on 7/8/2017.
 */

const express = require('express');

const app = express();
const port = normalizePort(process.env.PORT || '8080');

app.get('/', function (req, res) {
    res.send('Hello World!')
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