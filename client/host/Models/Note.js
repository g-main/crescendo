export default class Note {
    constructor(graphics, trackNum, time) {
        this.initialPosition = graphics.y;
        this.graphics = graphics;
        this.trackNum = trackNum;
        this.time = time;
    }

    // get y() { return this.graphics.y; }
    get track() { return this.trackNum; }
    get playTime() { return this.time; }
    get initialPosition() { return this.initialPosition; }

    getPosition

    // recalculatePosition(time) {
    //     this.graphics.y = this.initialPosition + (((NOTE_DELTA_Y * 60) / 1000) * time);
    // }
}
