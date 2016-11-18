import { TEXT_STYLES } from 'constants';

import Player from '../Models/Player';
import View from './View';
import Score from '../Models/Score';

const TRACK_LINE_WIDTH = 10; // pixels

const BOTTOM_BAR_PERCENTAGE = 7 / 10; // percentage of screen at which bar should be at
const BOTTOM_BAR_THICKNESS = 2; // pixels

const GROUP_INFO_INNER_PADDING = 10; // pixels

const addText =
    (game, width, height, text, style = TEXT_STYLES.SMALL_TEXT_FONT_STYLE, xAnchor = 0) => {
        const textView = game.add.text(width, height, text, style);
        textView.anchor.setTo(xAnchor, 0.5);
        return textView;
    };

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
        this.playerLines = {};

        this.playerGroup.forEach((player, playerIndex) => {
            // Subscribe each player to this view.
            // Updates to the model will be reflected in `this` view.
            // THIS OBJECT MUST HAVE A `notify` METHOD IMPLEMENTED!
            player.subscribe(this);

            const track = this.song.getTrack(player.instrument);
            const trackWidth = this.game.camera.width / track.length;
            const trackGraphicsArr = [];

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
                trackGraphic.beginFill(0xffffff, 0.6);
                trackGraphic.drawRect(0, 0, TRACK_LINE_WIDTH, this.bottomBar.y + 70);
                trackGraphic.endFill();
                trackGraphicsArr.push(trackGraphic);
            });
            this.playerLines[player.id] = trackGraphicsArr;

            // Draw player information
            const globalGraphicLocation = (playerIndex * this.game.camera.width) / playerCount;
            const localGraphicOffset = this.game.camera.width / (playerCount * 2);
            addText(
                this.game,
                globalGraphicLocation + localGraphicOffset + GROUP_INFO_INNER_PADDING,
                this.game.camera.height - 80,
                player.name,
            );
            addText(
                this.game,
                globalGraphicLocation + localGraphicOffset + GROUP_INFO_INNER_PADDING,
                this.game.camera.height - 57,
                capitalize(player.instrument),
            );
            const scoreView = addText(
                this.game,
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

                    if (!noteView.isPlayable && !noteView.playerAlreadyPlayed) {
                        // Register a MISS if the note has "gone off screen" and was not played by the player
                        this.playerGroup.getById(playerId).addScore(Score.MISS);
                    }

                    return noteView.isPlayable;
                });
            });
        });
    }

    notify(subject) {
        if (subject instanceof Player) {
            this.scoreViews[subject.id].setText(subject.score);
            // TODO: Animate the view based on updated score!
        }
    }
}
