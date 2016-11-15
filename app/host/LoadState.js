(function() {
    const GameState = require('./GameState.js');
    const {GAME_STATES, INSTRUMENTS} = require('../../constants.js');

    class LoadState extends GameState {
        constructor(game) {
            super(game);
        }

        preload() {
            this.game.load.audio('track', 'assets/tracks/beethoven_ode_to_joy.mp3');
            this.game.load.image(INSTRUMENTS.DRUMS, 'assets/img/drums.png');
        }

        create() {
            this.game.state.start(GAME_STATES.MENU);
        }
    }

    module.exports = LoadState;
})();

