(function() {

    const GameState = require('./GameState.js');
    const Player = require('./Player.js');

    // Harcoded track notes
    const TRACK_NOTES = [
        [3500, 4000, 4500, 5000, 7000],
        [0, 500, 3000, 5500, 6000, 6750],
        [1000, 2500],
        [1500, 2000]
    ];

    const NUM_NOTES = TRACK_NOTES.reduce((prev, curr) => prev + curr.length, 0);
    const INTERPOLATION_STEPS = 1200;
    const NOTE_DELTA_Y = 5;

    const NOTE_SIZE = {
        x: 100,
        y: 20,
    };

    class Note {

        constructor(graphics, track, time) {
            this.graphics = graphics;
            this._track = track;
            this.time = time;
        }

        get y() {
            return this.graphics.y;
        }

        get track() {
            return this._track;
        }

        get playTime() {
            return this.time;
        }

        incrementY(delta) {
            this.graphics.y += delta;
        }

    }

    class PlayState extends GameState {
        constructor(game, socket, roomId) {
            super(game);
            this.initializeSocket(socket);

            // Declare class members here
            this.playing = false;
            this.bottomBar = null;
            this.notes = []
            this.gameTrack = null;
            this.musicReady = false;

            this.player = new Player('mah name');
            this.roomId = roomId;
        }

        handleNotePlayed(data) {
            // Logic to check it was correctly played
            console.log(data);
        }

        initializeSocket(socket) {
            socket.on('noted', this.handleNotePlayed);
        }

        preload() {
            // Load assets
            this.game.stage.disableVisibilityChange = true;
            this.game.load.audio('track', 'assets/tracks/beethoven_ode_to_joy.mp3');
        }

        create() {
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

            //  Modify the world and camera bounds
            this.game.world.resize(this.game.world.width, this.game.world.height*1000);

            // Bar will be covered with an asset in the future, so this rectangle
            this.bottomBar = new Phaser.Rectangle(0, this.game.world.height - 20, this.game.world.width, 10);

            // Position at bottom of world
            this.game.camera.x = 0;
            this.game.camera.y = this.game.world.height - this.game.camera.height;

            this.notes = [];

            const bmd = this.game.add.bitmapData(this.game.camera.width, this.game.camera.height);
            bmd.addToWorld(this.game.camera.x, this.game.camera.y);

            let y = 0;
            const ySize = Math.ceil(this.game.camera.height / INTERPOLATION_STEPS);
            for (let i = 1; i <= INTERPOLATION_STEPS; i++) {
                const c = Phaser.Color.interpolateColor(0xfd4d34, 0xe73161, INTERPOLATION_STEPS, i);
                bmd.rect(0, y, this.game.camera.width, ySize, Phaser.Color.getWebRGB(c));
                y += ySize;
            }

            for (let i = 0; i < TRACK_NOTES.length; i++) {
                for (let j = 0; j < TRACK_NOTES[i].length; j++) {
                    const g = this.game.add.graphics(
                        i * this.game.camera.width/TRACK_NOTES.length,
                        (this.game.world.height - 20) - 60 * NOTE_DELTA_Y * TRACK_NOTES[i][j]/1000,
                    );
                    g.beginFill(0xffffff, 1);
                    g.drawRoundedRect(
                        0,
                        0,
                        NOTE_SIZE.x,
                        NOTE_SIZE.y,
                        9,
                    );
                    g.endFill();

                    this.notes.push(new Note(
                        g, // graphics
                        i, // track #
                        TRACK_NOTES[i][j], // time at which note should be played
                    ));
                }
            }

            this.gameTrack = this.game.add.audio('track');

            this.game.sound.setDecodedCallback(
                [this.gameTrack],
                () => { this.musicReady = true; },
                this,
            );
        }

        update() {
            if (this.musicReady) {
                this.gameTrack.play();
                this.playing = true;
                this.musicReady = false;
            }

            if (!this.playing){
                return;
            }

            for (let i = 0; i < this.notes.length; i++){
                const note = this.notes[i];
                note.incrementY(NOTE_DELTA_Y);
            }
        }

        render() {
            // Debug / text
            // TODO: Turn this into an actual rectangle (using graphics)
            this.game.debug.geom(this.bottomBar, '#ffffff');
            this.game.debug.text(this.roomId, 40, 120);
        }
    }

    module.exports = PlayState;
})();
