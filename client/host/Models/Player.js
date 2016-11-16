export default class Player {
    constructor(id, name, instrument) {
        this.id = id;
        this.name = name;
        this.instrument = instrument;
        this.score = 0;
    }

    incrementPoints(inc) {
        if (inc > 0) {
            this.score += inc;
        }
    }
}
