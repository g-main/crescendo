(function() {
    const GameState = require('./GameState.js');
    const INTERPOLATION_STEPS = 1200;

    const TITLE_FONT_STYLE = {
        font: '100px Arial',
        fill: '#ffffff'
    };

    const TEXT_FONT_STYLE = {
        font: '40px Arial',
        fill: '#ffffff'
    };

    const CALL_TO_ACTION_FONT_STYLE = {
        font: '50px Arial',
        fill: '#ffffff'
    };

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

            this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.addOnce(this.handleStart, this);

            this.game.add.text(this.centerX(240), 50, 'Crescendo', TITLE_FONT_STYLE);
            this.game.add.text(this.centerX(252), 300, 'An SE 464 Project made by:', TEXT_FONT_STYLE);
            this.game.add.text(this.centerX(575), 370, 'Sameer Chitley, Jami Boy Mohammad, Hasya Shah, Geoffrey Yu', TEXT_FONT_STYLE);
            this.game.add.text(this.centerX(245), this.game.camera.height - 150, 'Press ENTER to start!', CALL_TO_ACTION_FONT_STYLE);
        }

        handleStart() {
            this.game.state.start('Join');
        }

        centerX(offset) {
            return this.game.camera.width / 2 - offset;
        }
    }

    module.exports = MenuState;
})();
