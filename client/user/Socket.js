import io from 'socket.io-client';
import { SOCKET_EVENTS } from 'constants';

const roomId = window.location.pathname.split('/')[1].toLowerCase();

export default class Socket {
    constructor() {
        this._socket = null;
        this._queuedListeners = [];
    }

    addListener(ev, listener) {
        // If socket isn't initialized yet, add handlers
        // to a queue.
        if (!this._socket) {
            this._queuedListeners.push([ev, listener]);
        } else {
            this._socket.on(ev, listener);
        }
    }

    connect() {
        if (!this._socket) {
            this._socket = io.connect(`/${roomId}`);
            while (this._queuedListeners.length > 0) {
                this._socket.on(...this._queuedListeners.pop());
            }
        }
    }

    calibrationRequest(data) {
        this._socket.emit(SOCKET_EVENTS.CALIBRATION_REQUEST, data);
    }

    joinGame(data) {
        this._socket.emit(SOCKET_EVENTS.JOIN_GAME_REQUEST, data);
    }

    playNote(data) {
        this._socket.emit(SOCKET_EVENTS.PLAY_NOTE, data);
    }

    playerReady(data) {
        this._socket.emit(SOCKET_EVENTS.PLAYER_READY, data);
    }
}
