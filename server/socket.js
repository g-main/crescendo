import debugModule from 'debug';
import socket from 'socket.io';

import constants from '../constants';

const debug = debugModule('crescendo:socket');

let io;

function initialize(httpServer) {
    if (!io) {
        io = socket.listen(httpServer);
        debug('Initialized socket.io');
    } else {
        debug('Why is socket.js being initialized more than once?!');
    }
}

function createNamespace(roomId) {
    debug(`Creating namespace for roomId: ${roomId}`);

    const room = io.of(`/${roomId}`);
    room.on('connection', (socket) => {
        debug(`connected to ${roomId}`);

        socket.on(constants.SOCKET_EVENTS.PLAY_NOTE, (note) => {
            debug(`Note played: ${note}`);
            room.emit(constants.SOCKET_EVENTS.HANDLE_NOTE, note);
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

export {
    createNamespace,
    initialize,
};

