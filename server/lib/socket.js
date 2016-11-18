import debugModule from 'debug';
import socketio from 'socket.io';
import generateId from '../utils/generateId';

import { SOCKET_EVENTS } from '../../shared/constants';

const debug = debugModule('crescendo:socket');
let io = null;
const allocatedIds = {};

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
            const id = generateId(16, allocatedIds);
            allocatedIds[id] = socket;

            debug(`connected to ${roomId} as ${id}`);

            socket.emit(SOCKET_EVENTS.CONNECTED, { id });

            socket.on(SOCKET_EVENTS.PLAY_NOTE, (note) => {
                room.emit(SOCKET_EVENTS.HANDLE_NOTE, note);
            });

            socket.on(SOCKET_EVENTS.JOIN_GAME_REQUEST, ({ name, instrument }) => {
                room.emit(SOCKET_EVENTS.JOIN_GAME, { id, name, instrument });
            });

            socket.on(SOCKET_EVENTS.MISSED_NOTE, (data) => {
                allocatedIds[data.id].emit(SOCKET_EVENTS.MISSED_NOTE, data);
            });

            socket.on('disconnect', () => {
                delete allocatedIds[id];
                room.emit(SOCKET_EVENTS.LEFT_GAME, { id });
            });
        });
    },
};
