(function() {
    const io = require('socket.io-client');
    const constants = require('../constants.js');
    const MenuState = require('./MenuState.js');
    const JoinState = require('./JoinState.js');
    const PlayState = require('./PlayState.js');
    const SummaryState = require('./SummaryState.js');
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
        const gameConfig = {
            height: window.innerHeight,
            renderer: Phaser.Canvas,
            resolution: window.devicePixelRatio,
            width: window.innerWidth
        };

        const game = new Phaser.Game(gameConfig);

        game.state.add('Play', new PlayState(game, socket, roomId));
        game.state.add('Join', new JoinState(game));
        game.state.add('Menu', new MenuState(game));
        game.state.add('Summary', new SummaryState(game));

        game.state.start('Menu');
    }

    initialize();
})();
