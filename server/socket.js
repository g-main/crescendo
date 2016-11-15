import debugModule from 'debug';
import socketio from 'socket.io';

import constants from '../constants';

const debug = debugModule('crescendo:socket');

export default class Socket {
    constructor(httpServer) {
        this.io = socketio.listen(httpServer);
    }

    createNamespace(roomId) {
        debug(`Creating namespace for roomId: ${roomId}`);

        const room = this.io.of(`/${roomId}`);
        room.on('connection', (socket) => {
            debug(`connected to ${roomId}`);

            socket.on(constants.SOCKET_EVENTS.PLAY_NOTE, (note) => {
                debug(`Note played: ${note}`);
                room.emit(constants.SOCKET_EVENTS.HANDLE_NOTE, note);
            });
        });
    }
}
