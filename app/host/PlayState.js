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
            this.bottomBar = null;
            this.coins = null;
            // this.coinSound = null;
            // this.musicReady = false;
        }

        // Toggle fullscreen
        _goFull() {
            if (this.game.isFullScreen) {
                this.game.scale.stopFullScreen();
            } else {
                this.game.scale.startFullScreen(false);
            }
        }

        // _musicReady() {
        //     this.musicReady = true;
        // }

        preload() {
            // Load assets
            this.game.load.spritesheet('coin', 'assets/img/coin.png', 32, 32, 8);
            // this.game.load.audio('coin', 'assets/sounds/coin.mp3');
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

            // this.coinSound = game.add.audio('coin');

            // this.game.sound.setDecodedCallback(
            //     [this.coinSound],
            //     this._musicReady.bind(this),
            //     this,
            // );

            this.game.physics.enable([this.bottomBar, this.coins], Phaser.Physics.ARCADE);

        }

        update() {
            // no-op
            this.game.camera.y -= 1;
            this.bottomBar.y -= 1;

            // Coin collision
            // this.game.physics.arcade.collide(this.bottomBar, this.coins, function (bar, coin) {
            //   coin.destroy();
            //   if (this.musicReady) {
            //     this.coinSound.play();
            //   }
            // });
        }

        render() {
            // Debug / text
            this.game.debug.cameraInfo(this.game.camera, 32, 32);
            this.game.debug.geom(this.bottomBar, '#0fffff');
        }
    }

    module.exports = PlayState;
})();
