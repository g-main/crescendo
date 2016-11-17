export default class Track {
    constructor(type, notes) {
        this._type = type;
        this._notes = notes;
    }

    forEach(callback) {
        this._notes.forEach(callback);
    }

    get notes() {
        return this._notes;
    }

    get length() {
        return this._notes.length;
    }
}
