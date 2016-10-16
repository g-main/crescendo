const
    debug = require('debug')('crescendo:socket'),
    socketio = require('socket.io');

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

    const room = io.of('/' + roomId);
    room.on('connection', function (socket) {
        console.log(`connected to ${roomId}`);

        socket.on('playNote', function(note) {
            debug(note);
            room.emit('noted', note);
        });

        // socket.emit('sections', {
        //     sections: ['sec1', 'sec2', 'sec3']
        // });

        // socket.on('joinSection', function(section) {
        //     if (section) {
        //         socket.join(section);
        //     } else {
        //         debug('Uhh... why did joinSection not include a section?');
        //     }
        // });

        // socket.on('leaveSection', function(section) {
        //     if (section) {
        //         socket.leave(section);
        //     } else {
        //         debug('Uhh... why did leaveSection not include a section?');
        //     }
        // });
    });
}
