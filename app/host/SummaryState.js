(function() {
    const GameState = require('./GameState.js');
    const TextStyles = require('./TextStyles.js');

    class SummaryState extends GameState {
        constructor(game) {
            super(game);
        }

        create() {
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

