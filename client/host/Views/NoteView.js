import View from './View';

const NOTE_DELTA_Y = 4;
const NOTE_SIZE = {
    x: 100,
    y: 20,
};
const CREATE_AFTER = -100;
const REMOVE_AFTER = 100;

export default class NoteView extends View {
    constructor(game, { playAt, lineIndex, lineCount, playerIndex, playerCount, bottomBarOffset, globalNoteTrackPositiveOffset }) {
        super(game);
        this.playAt = playAt;
        this.lineIndex = lineIndex;
        this.playerIndex = playerIndex;
        this.playerCount = playerCount;
        this.bottomBarOffset = bottomBarOffset;
        this.lineCount = lineCount;
        this.globalNoteTrackPositiveOffset = globalNoteTrackPositiveOffset;

        this.graphics = null;

        this.initialY = (this.game.world.height - this.bottomBarOffset) -
            ((60 * NOTE_DELTA_Y * this.playAt) / 1000);
        this.y = this.initialY;
    }

    create() {
        const trackWidth = this.game.camera.width / this.lineCount;
        const globalNotePositiveOffset = this.globalNoteTrackPositiveOffset / this.lineCount;
        const noteNegativeOffset = this.lineIndex * globalNotePositiveOffset;
        const globalNoteLocation = (this.playerIndex * this.game.camera.width) / this.playerCount;
        const localNoteOffset =
            (((this.lineIndex * trackWidth) +
                ((trackWidth - NOTE_SIZE.x) / 2)) / this.playerCount) - noteNegativeOffset;

        const x = globalNotePositiveOffset + globalNoteLocation + localNoteOffset

        this.graphics = this.game.add.graphics(x, this.y);

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
        this.y = this.initialY + (((NOTE_DELTA_Y * 60) / 1000) * timeElapsed);

        // Lazily create the note graphic
        if (!this.graphics && (this.y > CREATE_AFTER)) {
            this.create();
        }

        if (this.graphics) {
            this.graphics.y = this.y;
            if (this.y > this.game.world.height - this.bottomBarOffset + REMOVE_AFTER) {
                this.graphics.destroy();
                // Return false to have PlayView delete this object
                return false;
            }
        }
        return true;
    }
}
