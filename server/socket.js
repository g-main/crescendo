const
    debug = require('debug')('spotlightbling:socket'),
    socketio = require('socket.io'),
    room = require('./room');

let io;

module.exports = {
    createNamespace: createNamespace,
    initialize: initialize
};

function initialize(httpServer) {
    if (!io) {
        io = socketio.listen(httpServer);
        debug('Initialized socket.io');
    } else {
        debug('Why is socket.js being initialized more than once?!');
    }
}

function createNamespace(roomId) {
    debug('Creating namespace for roomId: ' + roomId);

    io
    .of('/' + roomId)
    .on('connection', function (socket) {

        socket.emit('sections', {
            sections: ['sec1', 'sec2', 'sec3']
        });

        socket.on('joinSection', function(section) {
            if (section) {
                socket.join(section);
            } else {
                debug('Uhh... why did joinSection not include a section?');
            }
        });

        socket.on('leaveSection', function(section) {
            if (section) {
                socket.leave(section);
            } else {
                debug('Uhh... why did leaveSection not include a section?');
            }
        });

        // This event should only be sent from the host.
        socket.on('setColor', function(data) {
            if (data && data.roomId && data.hostId && data.section && data.color) {
                room.checkHostExists(data.hostId, function(err, exists) {
                    if (err || !exists) {
                        debug('You dun messed up A-A-RON.');
                    } else {
                        socket.to(data.section).emit('changeColor', { color: data.color });
                    }
                });
            } else {
                debug('Bruh... setColor requires roomId, hostId, section, and color.')
            }
        });
    });

    // startSlideshow(roomId, 'sec1');
}

function startSlideshow(roomId, section) {
    let colors = ['#E53400', '#1DEFFF', '#65E538', '#FFC937', '#9200E5'],
        idx = 0;

    setInterval(function() {
        debug('Emitting ' + colors[idx] + ' to ' + section + ' in room: ' + roomId);
        io.of('/' + roomId).to(section).emit('changeColor', { color: colors[idx++] });
        if (idx === colors.length) idx = 0;
    }, 3000);
}
