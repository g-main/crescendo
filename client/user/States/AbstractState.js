export default class AbstractState {
    constructor(player, socket, nextState) {
        this._player = player;
        this._socket = socket;
        this._nextState = nextState || null;
    }

    initialize() {

    }

    show() {
        if (this._dom && this._dom.wrapper) {
            this._dom.wrapper.classList.remove('hidden');
        }
    }

    hide() {
        if (this._dom && this._dom.wrapper) {
            this._dom.wrapper.parentNode.removeChild(this._dom.wrapper);
        }
    }

    next() {
        this.hide();
        if (this._nextState) this._nextState.initialize();
    }
}
