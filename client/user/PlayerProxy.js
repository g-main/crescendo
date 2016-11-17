import Player from '../host/Models/Player';

export default class PlayerProxy extends Player {
    constructor() {
        super();
        this._player = null;
    }

    get id() {
        return (this._player && this._player.id);
    }

    get instrument() {
        return (this._player && this._player.instrument);
    }

    get name() {
        return (this._player && this._player.name);
    }

    get score() {
        return (this._player && this._player.score);
    }

    set instrument(i) {
        if (this._player) {
            this._player.instrument = i;
        }
    }

    set name(n) {
        if (this._player) {
            this._player.name = n;
        }
    }

    set player(p) {
        if (!this._player) {
            this._player = p;
        }
    }

    set score(s) {
        if (this._player) {
            this._player.score = s;
        }
    }
}
