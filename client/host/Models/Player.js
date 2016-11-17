export default class Player {
    constructor(id, name, instrument) {
        this._id = id;
        this._name = name;
        this._instrument = instrument;
        this._score = 0;
    }

    get id() {
        return this._id;
    }

    get instrument() {
        return this._instrument;
    }

    get name() {
        return this._name;
    }

    get score() {
        return this._score;
    }

    set instrument(i) {
        this._instrument = i;
    }

    set name(n) {
        this._name = n;
    }

    set score(s) {
        this._score = s;
    }
}
