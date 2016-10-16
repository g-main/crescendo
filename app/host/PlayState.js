(function() {

    const GameState = require('./GameState.js');

    const NOTE_SIZE = {
        x: 100,
        y: 10,
    };

    class PlayState extends GameState {

        constructor(game) {
            super(game);

            // Declare class members here
            this.playing = false;
            this.bottomBar = null;
            this.coins = null;
            this.gameTrack = null;
            this.musicReady = false;
        }

        // Toggle fullscreen
        _goFull() {
            if (this.game.isFullScreen) {
                this.game.scale.stopFullScreen();
            } else {
                this.game.scale.startFullScreen(false);
            }
        }

        preload() {
            // Load assets
            this.game.load.spritesheet('coin', 'assets/img/coin.png', 32, 32, 8);
            this.game.load.audio('track', 'assets/tracks/beethoven_ode_to_joy.mp3');
        }

        create() {
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

            //  Modify the world and camera bounds
            this.game.world.resize(800, 6000);

            // Bar will be covered with an asset in the future, so this rectangle
            this.bottomBar = new Phaser.Rectangle(0, 5980,800, 10);


            // Position at bottom of world
            this.game.camera.x = 0;
            this.game.camera.y = this.game.world.height - this.game.camera.height;

            // Toggle fullscreen on click
            this.game.input.onDown.add(this._goFull, this);

            // Add coins (TODO: Replace with notes!)
            this.coins = this.game.add.group();

            for (let i = 0; i < this.game.world.height;
                    i += 100 ) {
                const coin = this.game.add.sprite(
                    this.game.world.randomX,
                    i,
                    'coin',
                );

                coin.width = 32;
                coin.height = 32;

                const rotateCoin = coin.animations.add('rotate');
                coin.animations.play('rotate', 30, true);
                this.coins.add(coin);
            }

            this.gameTrack = this.game.add.audio('track');

            this.game.sound.setDecodedCallback(
                [this.gameTrack],
                () => { this.musicReady = true; },
                this,
            );

            this.game.physics.enable([this.bottomBar, this.coins], Phaser.Physics.ARCADE);

        }

        update() {
            if (this.musicReady) {
                this.gameTrack.play();
                this.playing = true;
                this.musicReady = false;
            }

            if (this.playing) {
                this.game.camera.y -= 1;
                this.bottomBar.y -= 1;
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
