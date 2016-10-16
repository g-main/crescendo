(function() {
    const io = require('socket.io-client');
    const constants = require('../constants.js');
    const PlayState = require('./PlayState.js');
    const Phaser = window.Phaser;

    const gameConfig = {
        height: window.innerHeight,
        renderer: Phaser.Canvas,
        resolution: window.devicePixelRatio,
        width: window.innerWidth
    };

    const game = new Phaser.Game(gameConfig);

    game.state.add('Play', new PlayState(game));
    game.state.start('Play');
})();
