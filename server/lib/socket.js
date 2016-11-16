import debugModule from 'debug';
import socketio from 'socket.io';
import crypto from 'crypto';

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
            const id = crypto.randomBytes(16).toString('hex');
            debug(`connected to ${roomId} as ${id}`);

            socket.on(SOCKET_EVENTS.PLAY_NOTE, (note) => {
                room.emit(SOCKET_EVENTS.HANDLE_NOTE, note);
            });

            socket.on(SOCKET_EVENTS.JOIN_GAME_REQUEST, ({name, instrument}) => {
                room.emit(SOCKET_EVENTS.JOIN_GAME, {id, name, instrument});
            });

            socket.on('disconnect', () => {
                room.emit(SOCKET_EVENTS.LEFT_GAME, {id});
            });
        });
    },
};
