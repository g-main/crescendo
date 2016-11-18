import Observable from './Observable';
import Score from './Score';

export default class Player extends Observable {

    constructor(id, name, instrument) {
        super();
        this._id = id;
        this._name = name;
        this._instrument = instrument;
        this._score = new Score();
        this.observers = [];
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

    /* Returns a numeric value */
    get score() {
        return this._score.score;
    }

    set instrument(i) {
        this._instrument = i;
    }

    set name(n) {
        this._name = n;
    }

    addScore(score) {
        console.log("incrementing score", score.toString());
        this._score.increment(score);
        this.update();
    }

    subscribe(observer) {
        this.observers.push(observer);
    }
}
