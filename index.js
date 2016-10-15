const
    debug = require('debug')('spotlightbling:index'),
    express = require('express'),
    http = require('http'),
    path = require('path'),

    app = express(),
    httpServer = http.createServer(app),

    io = require('./server/socket'),
    room = require('./server/room');

app.use('/assets', express.static('./dist/assets'));
app.use('/js', express.static('./dist/js'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './app/landing/index.html'));
});

app.get(/^\/[a-fA-F0-9]{4}\/?$/, function(req, res) {
    room.checkRoomExists(req.url.split('/')[1].toLowerCase(), function(err, exists) {
        if (err || !exists) {
            res.redirect('/');
        } else {
            res.sendFile(path.join(__dirname, './app/user/index.html'));
        }
    });
});

app.get(/^\/[a-fA-F0-9]{16}\/?$/, function(req, res) {
    room.checkHostExists(req.url.split('/')[1].toLowerCase(), function(err, exists) {
        if (err || !exists) {
            res.redirect('/');
        } else {
            res.sendFile(path.join(__dirname, './app/host/index.html'));
        }
    });
});

app.get('/create', function(req, res) {
    room.createRoom(function(err, r) {
        if (err || !r) {
            res.send(500);
        } else {
            io.createNamespace(r.roomId);
            res.redirect(`/${r.hostId}`);
        }
    });
});

httpServer.listen(3000, function() {
    debug('OMG! Server is up!');
    io.initialize(httpServer);
});
