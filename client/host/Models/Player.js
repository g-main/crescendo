import Observable from './Observable';
import Score from './Score';

export default class Player extends Observable {

    constructor(id, name, instrument, calibration) {
        super();
        this._id = id;
        this._name = name;
        this._instrument = instrument;
        this._calibration = calibration;
        this._score = new Score();
        this.observers = [];
    }

    get id() {
        return this._id;
    }

    get calibration() {
        return this._calibration;
    }

    get instrument() {
        return this._instrument;
    }

    get name() {
        return this._name;
    }

    /* Returns a numeric value */
    get score() {
        return this._score.score;
    }

    get rawScore() {
        return this._score;
    }

    set calibration(c) {
        this._calibration = c;
    }

    set instrument(i) {
        this._instrument = i;
    }

    set name(n) {
        this._name = n;
    }

    addScore(score) {
        this._score.increment(score);
        this.update();
    }

    resetScore() {
        this._score.reset();
    }
}
