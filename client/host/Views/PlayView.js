import View from './View';
import Score from '../Models/Score';

const TRACK_LINE_WIDTH = 10; // pixels

const BOTTOM_BAR_PERCENTAGE = 7 / 10; // percentage of screen at which bar should be at
const BOTTOM_BAR_THICKNESS = 2; // pixels

export default class PlayView extends View {
    constructor(game, playerGroup, song) {
        super(game);
        this.playerGroup = playerGroup;
        this.song = song;
        this.notes = [];
        this.initialize();
    }

    debug() {
        this.game.debug.geom(this.bottomBar, '#ffffff');
        this.game.debug.text(`FPS: ${this.game.time.fps}`, 40, 30);
    }

    set noteViews(v) {
        this._noteViews = v;
    }

    initialize() {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        //  Modify the world and camera bounds
        this.game.world.resize(this.game.world.width, this.game.world.height);

        this.bottomBarOffset = this.game.camera.height * (1 - BOTTOM_BAR_PERCENTAGE);

        // Bar will be covered with an asset in the future, so this rectangle
        this.bottomBar = new Phaser.Rectangle(
            0,
            this.game.world.height - this.bottomBarOffset - (BOTTOM_BAR_THICKNESS / 2),
            this.game.world.width,
            BOTTOM_BAR_THICKNESS,
        );

        const playerCount = this.playerGroup.getNumPlayers();
        this.globalNoteTrackPositiveOffset = this.game.camera.width / (playerCount * 4);

        this.playerGroup.forEach((player, playerIndex) => {
            const track = this.song.getTrack(player.instrument);
            const trackWidth = this.game.camera.width / track.length;

            track.forEach((line, lineIndex) => {
                const globalNotePositiveOffset = this.globalNoteTrackPositiveOffset / track.length;
                const noteNegativeOffset = lineIndex * globalNotePositiveOffset;

                const globalTrackLocation = (playerIndex * this.game.camera.width) / playerCount;
                const localTrackOffset =
                    (((lineIndex * trackWidth) +
                        ((trackWidth - TRACK_LINE_WIDTH) / 2)) / playerCount) - noteNegativeOffset;

                const trackGraphic = this.game.add.graphics(
                    globalNotePositiveOffset + globalTrackLocation + localTrackOffset, /* x */
                    0, /* y */
                );
                trackGraphic.beginFill(0xffffff, 1);
                trackGraphic.drawRect(0, 0, TRACK_LINE_WIDTH, this.game.world.height);
                trackGraphic.endFill();
            });
        });
    }

    update(timeElapsed) {
        Object.keys(this._noteViews).forEach((playerId) => {
            this._noteViews[playerId].forEach((line, lineIndex) => {
                this._noteViews[playerId][lineIndex] = line.filter((noteView) => {
                    return noteView.update(timeElapsed);
                });
            });
        });
    }
}
