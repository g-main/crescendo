(function() {
    const GameState = require('./GameState.js');
    const TextStyles = require('./TextStyles.js');
    const INTERPOLATION_STEPS = 1200;

    class SummaryState extends GameState {
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

            this.game.add.text(this.centerX(365), 50, 'Game Summary', TextStyles.TITLE_FONT_STYLE);
            this.game.add.text(this.centerX(450), this.game.camera.height - 100, 'Press R to start a new game or Q to exit', TextStyles.CALL_TO_ACTION_FONT_STYLE);

            this.game.input.keyboard.addKey(Phaser.Keyboard.R).onDown.addOnce(() => {
                this.game.state.start('Join');
            }, this);

            this.game.input.keyboard.addKey(Phaser.Keyboard.Q).onDown.addOnce(() => {
                this.game.state.start('Menu');
            }, this);
        }

        centerX(offset) {
            return this.game.camera.width / 2 - offset;
        }
    }

    module.exports = SummaryState;
})();

