import { TEXT_STYLES } from 'constants';
import View from './View';

const TRACK_LINE_WIDTH = 10; // pixels
export const TRACK_LINE_DEPTH = 100; // pixels

const PULSE_UP = 10;
const PULSE_DOWN = 200;

const TEXT_FEEDBACK = 400;
const TEXT_FEEDBACK_DELAY = 150;

export default class TrackView extends View {
    constructor(game,
            { track, globalNoteTrackPositiveOffset, bottomBarY, playerIndex, playerCount }) {
        super(game);
        this.track = track;
        this.globalNoteTrackPositiveOffset = globalNoteTrackPositiveOffset;
        this.playerIndex = playerIndex;
        this.playerCount = playerCount;
        this.bottomBarY = bottomBarY;
        this.trackGraphics = [];
        this.create();
    }

    create() {
        const trackWidth = this.game.camera.width / this.track.length;
        const globalNotePositiveOffset = this.globalNoteTrackPositiveOffset / this.track.length;

        this.track.forEach((line, lineIndex) => {
            const noteNegativeOffset = lineIndex * globalNotePositiveOffset;
            const globalTrackLocation = (this.playerIndex * this.game.camera.width) /
                                            this.playerCount;
            const localTrackOffset =
                (((lineIndex * trackWidth) +
                    ((trackWidth - TRACK_LINE_WIDTH) / 2)) / this.playerCount) - noteNegativeOffset;

            const trackGraphic = this.game.add.graphics(
                globalNotePositiveOffset + globalTrackLocation + localTrackOffset, /* x */
                0, /* y */
            );
            trackGraphic.beginFill(0xffffff, 0.6);
            trackGraphic.drawRect(0, 0, TRACK_LINE_WIDTH, this.bottomBarY + 70);
            trackGraphic.endFill();
            this.trackGraphics.push(trackGraphic);
        });
    }

    indicateLinePressed(lineIndex) {
        const lineGraphics = this.trackGraphics[lineIndex];
        this.game.add.tween(lineGraphics).to({ alpha: 1.75 }, PULSE_UP, Phaser.Easing.None, true);
        setTimeout(() => {
            this.game.add.tween(lineGraphics)
                .to({ alpha: 1 }, PULSE_DOWN, Phaser.Easing.None, true);
        }, PULSE_UP);
    }

    displayScoreTextFeedback(score, lineIndex) {
        const xLocation = this.trackGraphics[lineIndex].x + (TRACK_LINE_WIDTH / 2);
        const text = this.game.add
                        .text(xLocation, 150, score, TEXT_STYLES.TEXT_FEEDBACK);
        this.game.add.tween(text).to({ y: 120 }, TEXT_FEEDBACK, Phaser.Easing.None, true);
        text.anchor.x = 0.5;
        setTimeout(() => {
            this.game.add.tween(text)
                .to({ alpha: 0 }, TEXT_FEEDBACK - TEXT_FEEDBACK_DELAY, Phaser.Easing.None, true);
        }, TEXT_FEEDBACK_DELAY);
        setTimeout(() => text.destroy(), TEXT_FEEDBACK);
    }
}
