const
    debug = require('debug')('crescendo:index'),
    express = require('express'),
    http = require('http'),
    path = require('path'),

    app = express(),
    httpServer = http.createServer(app),
    apiRouter = express.Router(),

    io = require('./server/socket'),
    room = require('./server/room');

app.use('/assets', express.static('./dist/assets'));
app.use('/js', express.static('./dist/js'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './dist/host.html'));
});

app.get(/^\/[a-fA-F0-9]{4}\/?$/, function(req, res) {
    if (room.checkRoomExists(req.url.split('/')[1].toLowerCase())) {
        res.sendFile(path.join(__dirname, './dist/user.html'));
    } else {
        res.redirect('/');
    }
});

apiRouter.get('/create', function(req, res) {
    let host = room.createHost();
    io.createNamespace(host.roomId);
    res.json(host);
});

app.use('/api/v0', apiRouter);

httpServer.listen(3000, function() {
    debug('OMG! Server is up!');
    io.initialize(httpServer);
});
