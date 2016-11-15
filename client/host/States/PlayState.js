import { GAME_STATES, SOCKET_EVENTS } from 'constants';
import GameState from './GameState';
import Player from '../Models/Player';

const TRACK_NOTES = [
    [3500, 4000, 4500, 5000, 7000, 11500, 12000, 12500, 13000, 15000,
        17500, 19500, 22000, 23000, 27500, 28000, 28500, 29000, 31000],
    [0, 500, 3000, 5500, 6000, 6750, 8000, 8500, 11000, 13500, 14000,
        14750, 15000, 16000, 16500, 18000, 20000, 21500, 22500, 24000,
        24500, 27000, 29500, 30000, 30750],
    [1000, 2500, 9000, 10500, 17000, 18500, 19000, 20500, 21000, 25000, 26500],
    [1500, 2000, 9500, 10000, 12000, 18750, 20750, 25500, 26000],
];

const NOTE_DELTA_Y = 5;

const NOTE_SIZE = {
    x: 100,
    y: 20,
};

const TRACK_LINE_WIDTH = 10; // pixels

const NUM_USERS = 1;

const TRACK_KEY = 'track';

// The amount of time (in note travel distance) after which the
// last note moves offscreen before we move to the next state
const END_GAME_OFFSET = 240;

class Note {
    constructor(graphics, trackNum, time) {
        this.initialY = graphics.y;
        this.graphics = graphics;
        this.trackNum = trackNum;
        this.time = time;
    }

    get y() {
        return this.graphics.y;
    }

    get track() {
        return this.trackNum;
    }

    get playTime() {
        return this.time;
    }

    recalculatePosition(time) {
        this.graphics.y = this.initialY + (((NOTE_DELTA_Y * 60) / 1000) * time);
    }

}

export default class PlayState extends GameState {
    constructor(game, socket) {
        super(game);
        this.initializeSocket(socket);

        // Declare class members here
        this.playing = false;
        this.bottomBar = null;
        this.notes = [];
        this.gameTrack = null;
        this.musicReady = false;

        this.player = new Player('mah name');
        this.startTime = null;
        this.lastNoteInSong = null;
    }

    handleNotePlayed(data) {
        // Logic to check it was correctly played
        const color = {
            blue: 0,
            green: 1,
            yellow: 2,
            red: 3,
        };

        const trackIndex = color[data.color];
        const relativeTime = data.timestamp - this.startTime;

        TRACK_NOTES[trackIndex].forEach(note => {
            if (relativeTime > note - 250 && relativeTime <= note + 250) {
                this.player.score += 10;
            }
        });
        // TODO: delete note on success (if implemented, need to keep last note)
    }

    initializeSocket(socket) {
        socket.on(SOCKET_EVENTS.HANDLE_NOTE, this.handleNotePlayed.bind(this));
    }

    preload() {
        // Load assets
        this.game.stage.disableVisibilityChange = true;

        // Enable FPS
        this.game.time.advancedTiming = true;
    }

    create() {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        //  Modify the world and camera bounds
        this.game.world.resize(this.game.world.width, this.game.world.height);

        // Bar will be covered with an asset in the future, so this rectangle
        this.bottomBar = new Phaser.Rectangle(0,
            this.game.world.height - 20, this.game.world.width, 2);

        // Position at bottom of world
        this.game.camera.x = 0;
        this.game.camera.y = this.game.world.height - this.game.camera.height;

        const trackWidth = this.game.camera.width / (TRACK_NOTES.length);
        for (let i = 0; i < TRACK_NOTES.length; i++) {
            const trackGraphic = this.game.add.graphics(((i * trackWidth) +
                ((trackWidth - TRACK_LINE_WIDTH) / 2)) / NUM_USERS, 0);
            trackGraphic.beginFill(0xffffff, 1);
            trackGraphic.drawRect(0, 0, TRACK_LINE_WIDTH, this.game.world.height);
            trackGraphic.endFill();

            // Draw notes
            for (let j = 0; j < TRACK_NOTES[i].length; j++) {
                const g = this.game.add.graphics(
                    ((i * trackWidth) + ((trackWidth - NOTE_SIZE.x) / 2)) / NUM_USERS,
                    (this.game.world.height - 20) - ((60 * NOTE_DELTA_Y * TRACK_NOTES[i][j])
                    / 1000),
                );
                g.beginFill(0xffffff, 1);
                g.drawRoundedRect(
                    0,
                    0,
                    NOTE_SIZE.x / NUM_USERS,
                    NOTE_SIZE.y,
                    9,
                );
                g.endFill();
                let noteColor = 0xffffff;
                switch (i) {
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
                g.beginFill(noteColor, 1);
                g.drawRoundedRect(
                    3,
                    3,
                    (NOTE_SIZE.x / NUM_USERS) - 6,
                    NOTE_SIZE.y - 6,
                    9,
                );
                g.endFill();
                const note = new Note(
                    g, // graphics
                    i, // track #
                    TRACK_NOTES[i][j], // time at which note should be played
                );

                this.notes.push(note);
                if (this.lastNoteInSong == null || this.lastNoteInSong.y > g.y) {
                    this.lastNoteInSong = note;
                }
            }
        }

        this.gameTrack = this.game.add.audio(TRACK_KEY);

        this.game.sound.setDecodedCallback(
            [this.gameTrack],
            () => { this.musicReady = true; },
            this,
        );

        this.game.input.keyboard.addKey(Phaser.Keyboard.L).onDown.addOnce(
            this.transitionToSummary.bind(this),
            this,
        );
    }

    update() {
        if (this.musicReady) {
            this.gameTrack.play();
            this.playing = true;
            this.musicReady = false;
            this.startTime = Date.now();
        }

        if (!this.playing) {
            return;
        }

        const relativeTime = Date.now() - this.startTime;
        for (let i = 0; i < this.notes.length; i++) {
            const note = this.notes[i];
            note.recalculatePosition(relativeTime);
        }

        // Check for last note having moved off screen ( plus an offset )
        if (this.lastNoteInSong.y > this.game.camera.y +
                this.game.camera.height + END_GAME_OFFSET) {
            this.transitionToSummary();
        }
    }

    render() {
        // Debug / text
        // TODO: Turn this into an actual rectangle (using graphics)
        this.game.debug.geom(this.bottomBar, '#ffffff');
        this.game.debug.text(this.player.score, 40, 160);

        this.game.debug.text(`FPS: ${this.game.time.fps}`, 40, 30);
    }

    shutdown() {
        this.gameTrack.stop();
        this.gameTrack.destroy();
        this.gameTrack = null;
        this.bottomBar = null;
        this.notes.forEach((note) => (note.graphics.destroy()));
        this.notes = [];
    }

    transitionToSummary() {
        this.game.state.start(GAME_STATES.SUMMARY);
    }
}
