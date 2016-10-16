(function() {
    const io = require('socket.io-client');
    const constants = require('../constants.js');
    const PlayState = require('./PlayState.js');
    const Phaser = window.Phaser;

    const game = new Phaser.Game(
        window.innerWidth,
        window.innerHeight,
        Phaser.Canvas,
        'Game',
    );

    game.state.add('Play', new PlayState(game));
    game.state.start('Play');
})();
