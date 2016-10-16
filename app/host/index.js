(function() {
    const io = require('socket.io-client');
    const constants = require('../constants.js');
    const PlayState = require('./PlayState.js');
    const Phaser = window.Phaser;

    function httpGet(url) {
        const promise = new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();

            request.onreadystatechange = () => {
                if (request.readyState !== XMLHttpRequest.DONE) {
                    return;
                }

                if (request.status === 200) {
                    resolve(request);
                } else {
                    reject(request);
                }
            };
            request.open('GET', url, true);
            request.send();
        });

        return promise;
    }

    function initialize() {
        httpGet('/api/v0/create').then((request) => {
            let roomId = JSON.parse(request.response).roomId;
            let socket = io.connect(`/${roomId}`);
            console.log(roomId);
            initializeGame(socket, roomId);
        });
    }

    function initializeGame(socket, roomId) {
        const game = new Phaser.Game(
            window.innerWidth,
            window.innerHeight,
            Phaser.Canvas,
            'Game',
        );

        game.state.add('Play', new PlayState(game, socket, roomId));
        game.state.start('Play');
    }

    initialize();
})();
