import Player from '../Models/Player';
import View from './View';
import Score from '../Models/Score';

const BOTTOM_BAR_PERCENTAGE = 7 / 10; // percentage of screen at which bar should be at
const BOTTOM_BAR_THICKNESS = 2; // pixels

const GROUP_INFO_INNER_PADDING = 10; // pixels

export const TRACK_LINE_DEPTH = 100; // pixels

const capitalize = word => word.charAt(0).toUpperCase().concat(word.slice(1));

export default class PlayView extends View {
    constructor(game, playerGroup, song) {
        super(game);
        this.playerGroup = playerGroup;
        this.song = song;
        this.notes = [];
        this.scoreViews = [];
        this.initialize();
    }

    debug() {
        this.game.debug.geom(this.bottomBar, '#ffffff');
        this.game.debug.text(`FPS: ${this.game.time.fps}`, 40, 30);
    }

    set noteViews(v) {
        this._noteViews = v;
    }

    set trackViews(v) {
        this._trackViews = v;
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
            // Subscribe each player to this view.
            // Updates to the model will be reflected in `this` view.
            // THIS OBJECT MUST HAVE A `notify` METHOD IMPLEMENTED!
            player.subscribe(this);

            // Draw player information
            const globalGraphicLocation = (playerIndex * this.game.camera.width) / playerCount;
            const localGraphicOffset = this.game.camera.width / (playerCount * 2);
            this.addText(
                globalGraphicLocation + localGraphicOffset + GROUP_INFO_INNER_PADDING,
                this.game.camera.height - 80,
                player.name,
            );
            this.addText(
                globalGraphicLocation + localGraphicOffset + GROUP_INFO_INNER_PADDING,
                this.game.camera.height - 57,
                capitalize(player.instrument),
            );
            const scoreView = this.addText(
                globalGraphicLocation + localGraphicOffset + GROUP_INFO_INNER_PADDING,
                this.game.camera.height - 35,
                '0',
            );
            this.scoreViews[player.id] = scoreView;
            const instrumentImage = this.game.add.sprite(
                (globalGraphicLocation + localGraphicOffset) - GROUP_INFO_INNER_PADDING,
                this.game.camera.height - 60,
                `${player.instrument}_white`,
            );
            instrumentImage.scale.setTo(0.5, 0.5);
            instrumentImage.anchor.setTo(1, 0.5);
        });
    }

    update(timeElapsed) {
        Object.keys(this._noteViews).forEach((playerId) => {
            this._noteViews[playerId].forEach((line, lineIndex) => {
                this._noteViews[playerId][lineIndex] = line.filter((noteView) => {
                    noteView.update(timeElapsed);

                    // Register a MISS if an unplayed note has "gone off screen"
                    if (!noteView.isPlayable && !noteView.playerAlreadyPlayed) {
                        this.playerGroup.getById(playerId).addScore('MISS');
                    }

                    return noteView.isPlayable;
                });
            });
        });
    }

    notify(subject) {
        if (subject instanceof Player) {
            this.scoreViews[subject.id].setText(subject.score);
        }
    }
}
