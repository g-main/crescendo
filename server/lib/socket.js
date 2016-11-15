import debugModule from 'debug';
import socketio from 'socket.io';

import { SOCKET_EVENTS } from '../../shared/constants';

const debug = debugModule('crescendo:socket');
let io = null;

export default {
    initialize(httpServer) {
        if (io) {
            throw new Error('Socket is being initialized twice!');
        }

        io = socketio.listen(httpServer);
    },

    createNamespace(roomId) {
        debug(`Creating namespace for roomId: ${roomId}`);

        const room = io.of(`/${roomId}`);
        room.on('connection', (socket) => {
            debug(`connected to ${roomId}`);

            socket.on(SOCKET_EVENTS.PLAY_NOTE, (note) => {
                debug(`Note played: ${note}`);
                room.emit(SOCKET_EVENTS.HANDLE_NOTE, note);
            });
        });
    },
};
