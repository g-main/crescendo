import Player from '../../host/Models/Player';
import { SOCKET_EVENTS } from 'constants';

export default class ConnectingState {
    constructor(player, socket, nextState) {
        this._player = player;
        this._socket = socket;
        this._nextState = nextState || null;

        this._dom = {
            page: document.getElementById('page-wrapper'),
            wrapper: document.getElementById('connecting-wrapper')
        };
    }

    initialize() {
        this._socket.addListener(SOCKET_EVENTS.CONNECTED, this.onSocketConnected.bind(this));
        this._socket.connect();

        this.show();
    }

    show() {
        this._dom.page.classList.add('connecting');
        this._dom.wrapper.classList.remove('hidden');
    }

    hide() {
        this._dom.page.classList.remove('connecting');
        this._dom.wrapper.classList.add('hidden');
    }

    next() {
        this.hide();
        if (this._nextState) this._nextState.initialize();
    }

    onSocketConnected(data) {
        // Must wait until socket connects to create player object
        // since we need to get the playerId from the server.
        this._player.player = new Player(data.id, 'Werner', null);

        setTimeout(this.next.bind(this), 3000);
    }
}
