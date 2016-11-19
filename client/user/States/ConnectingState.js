import { SOCKET_EVENTS } from 'constants';
import AbstractState from './AbstractState';
import Player from '../../host/Models/Player';

export default class ConnectingState extends AbstractState {
    constructor(player, socket, nextState) {
        super(player, socket, nextState);

        this._dom = {
            page: document.getElementById('page-wrapper'),
            wrapper: document.getElementById('connecting-wrapper'),
        };
    }

    initialize() {
        this._socket.addListener(SOCKET_EVENTS.CONNECTED, this.onSocketConnected.bind(this));
        this._socket.connect();

        this.show();
    }

    show() {
        super.show();
        this._dom.page.classList.add('connecting');
    }

    hide() {
        super.hide();
        this._dom.page.classList.remove('connecting');
    }

    next() {
        super.next();
    }

    onSocketConnected(data) {
        // Must wait until socket connects to create player object
        // since we need to get the playerId from the server.
        this._player.player = new Player(data.id, 'Werner', null);

        setTimeout(this.next.bind(this), 1000);
    }
}
