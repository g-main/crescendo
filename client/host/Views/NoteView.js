const NOTE_DELTA_Y = 4;
const NOTE_SIZE = {
    x: 100,
    y: 20,
};

export default class NoteView {
    constructor(game, x, y, lineIndex, playerCount) {
        this.game = game;
        this.initialPosition = y;
        this.graphics = this.game.add.graphics(x, y);
        this.lineIndex = lineIndex;
        this.playerCount = playerCount;
        this.initialize();
    }

    initialize() {
        this.graphics.beginFill(0xffffff, 1);
        this.graphics.drawRoundedRect(
            0, /* topLeftX */
            0, /* topLeftY */
            NOTE_SIZE.x / this.playerCount, /* width */
            NOTE_SIZE.y, /* height */
            9, /* roundness */
        );
        this.graphics.endFill();
        // Assign color of note based on track
        let noteColor = 0xffffff;
        switch (this.lineIndex) {
        case 0:
            noteColor = 0x008aff;
            break;
        case 1:
            noteColor = 0x00b800;
            break;
        case 2:
            noteColor = 0xffce00;
            break;
        case 3:
            noteColor = 0xff3700;
            break;
        default:
            break;
        }
        // Draw inner note rectangle (filled color of note)
        this.graphics.beginFill(noteColor, 1);
        this.graphics.drawRoundedRect(
            3, /* topLeftX */
            3, /* topLeftY */
            (NOTE_SIZE.x / this.playerCount) - 6, /* width */
            NOTE_SIZE.y - 6, /* height */
            9, /* roundness */
        );
        this.graphics.endFill();
    }

    update(timeElapsed) {
        this.graphics.y = this.initialPosition + (((NOTE_DELTA_Y * 60) / 1000) * timeElapsed);
    }
}
