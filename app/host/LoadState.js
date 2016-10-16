(function() {
    const GameState = require('./GameState.js');
    class LoadState extends GameState {
        constructor(game) {
            super(game);
        }

        create() {
            this.game.state.start('Play');
        }
    }

    module.exports = LoadState;
})();
