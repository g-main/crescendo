(function() {
    const GameState = require('./GameState.js');
    const INTERPOLATION_STEPS = 1200;

    class MenuState extends GameState {
        constructor(game) {
            super(game);
        }

        create() {
            const bmd = this.game.add.bitmapData(this.game.camera.width, this.game.camera.height);
            bmd.addToWorld(this.game.camera.x, this.game.camera.y);

            let y = 0;
            const ySize = Math.ceil(this.game.camera.height / INTERPOLATION_STEPS);
            for (let i = 1; i <= INTERPOLATION_STEPS; i++) {
                const c = Phaser.Color.interpolateColor(0xfd4d34, 0xe73161, INTERPOLATION_STEPS, i);
                bmd.rect(0, y, this.game.camera.width, ySize, Phaser.Color.getWebRGB(c));
                y += ySize;
            }

            this.game.input.keyboard.addKey(Phaser.Keyboard.W).onDown.addOnce(this.handleStart, this);
            this.game.add.text(80, 80, 'Crescendo', {
                font: '100px Arial',
                fill: '#FFFFFF'
            });

            this.game.add.text(80, 200, 'Press "w" to start', {
                font: '50px Arial',
                fill: '#FFFFFF'
            });
        }

        handleStart() {
            this.game.state.start('Load');
        }
    }

    module.exports = MenuState;
})();
