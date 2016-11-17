import View from './View';
import NoteView from './NoteView';

const NOTE_DELTA_Y = 4;
const NOTE_SIZE = {
    x: 100,
    y: 20,
};
const TRACK_LINE_WIDTH = 10; // pixels

const BOTTOM_BAR_PERCENTAGE = 7 / 10; // percentage of screen at which bar should be at

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

    initialize() {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        //  Modify the world and camera bounds
        this.game.world.resize(this.game.world.width, this.game.world.height);

        this.bottomBarOffset = this.game.camera.height * (1 - BOTTOM_BAR_PERCENTAGE);

        // Bar will be covered with an asset in the future, so this rectangle
        this.bottomBar = new Phaser.Rectangle(0,
            this.game.world.height - this.bottomBarOffset - 1, this.game.world.width, 2);

        const playerCount = this.playerGroup.getNumPlayers();

        this.playerGroup.forEach((player, playerIndex) => {
            const track = this.song.getTrack(player.instrument);
            const trackWidth = this.game.camera.width / track.length;

            track.forEach((line, lineIndex) => {
                const globalNotePositiveOffset =
                    this.game.camera.width / (track.length * playerCount * 4);
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

                line.forEach((note, noteIndex) => {
                    const globalNoteLocation = (playerIndex * this.game.camera.width) / playerCount;
                    const localNoteOffset =
                        (((lineIndex * trackWidth) +
                            ((trackWidth - NOTE_SIZE.x) / 2)) / playerCount) - noteNegativeOffset;
                    const y = (this.game.world.height - this.bottomBarOffset) -
                        ((60 * NOTE_DELTA_Y * line[noteIndex]) / 1000);

                    const noteView = new NoteView(
                        this.game,
                        globalNotePositiveOffset + globalNoteLocation + localNoteOffset, /* x */
                        (this.game.world.height - this.bottomBarOffset) -
                            ((60 * NOTE_DELTA_Y * line[noteIndex]) / 1000), /* y */
                        lineIndex,
                        playerCount,
                    );

                    this.notes.push(noteView);

                    if (this.lastNoteInSong == null || this.lastNoteInSong.initialPosition > y) {
                        this.lastNoteInSong = noteView;
                    }
                });
            });
        });
    }

    update(timeElapsed) {
        this.notes.forEach(note => note.update(timeElapsed));
    }
}
