(function() {

    const GameState = require('./GameState.js');

    const NOTE_SIZE = {
        x: 100,
        y: 20,
    };

    class PlayState extends GameState {

        constructor(game) {
            super(game);

            // Declare class members here
            this.bottomBar = null;
            this.notes = []
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
        }

        update() {
            // no-op
            // this.game.camera.y -= 1;
            // this.bottomBar.y -= 1;
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
