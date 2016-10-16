(function() {

    const GameState = require('./GameState.js');

    const trackNotes = [
        [3500, 4000, 4500, 5000, 7000],
        [0, 500, 3000, 5500, 6000, 6750],
        [1000, 2500],
        [1500, 2000]
    ];
    const tempo = 120;

    const NOTE_SIZE = {
        x: 100,
        y: 20,
    };

    class PlayState extends GameState {

        constructor(game) {
            super(game);

            // Declare class members here
            this.playing = false;
            this.bottomBar = null;
            this.notes = []
            this.gameTrack = null;
            this.musicReady = false;
        }

        preload() {
            // Load assets
            this.game.load.spritesheet('coin', 'assets/img/coin.png', 32, 32, 8);
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

            for (let i = 0; i < this.game.world.height; i += 100 ) {
                const g = this.game.add.graphics(0, i);
                this.notes.push(g);
                g.lineStyle(2);
                g.beginFill(0xffffff, 1);
                g.drawRect(
                    this.game.rnd.between(0, this.game.world.width - NOTE_SIZE.x),
                    i,
                    NOTE_SIZE.x,
                    NOTE_SIZE.y,
                );
                g.endFill();
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
                note.y += 1;
            }
        }

        render() {
            // Debug / text
            this.game.debug.cameraInfo(this.game.camera, 32, 32);
            this.game.debug.geom(this.bottomBar, '#0fffff');
        }
    }

    module.exports = PlayState;
})();
