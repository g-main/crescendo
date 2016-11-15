import 'whatwg-fetch';
import io from 'socket.io-client';
import { GAME_STATES } from 'constants';
import MenuState from './MenuState';
import JoinState from './JoinState';
import PlayState from './PlayState';
import LoadState from './LoadState';
import SummaryState from './SummaryState.js';


(() => {
    const Phaser = window.Phaser;

    function initializeGame(socket, roomId) {
        const gameConfig = {
            height: window.innerHeight,
            renderer: Phaser.Canvas,
            resolution: window.devicePixelRatio,
            width: window.innerWidth,
            transparent: true,
        };

        const game = new Phaser.Game(gameConfig);

        game.state.add(GAME_STATES.LOAD, new LoadState(game));
        game.state.add(GAME_STATES.PLAY, new PlayState(game, socket));
        game.state.add(GAME_STATES.JOIN, new JoinState(game, roomId, socket));
        game.state.add(GAME_STATES.MENU, new MenuState(game));
        game.state.add(GAME_STATES.SUMMARY, new SummaryState(game));

        game.state.start(GAME_STATES.LOAD);
    }

    function initialize() {
        fetch('/api/v0/create', { method: 'GET' })
            .then(request => request.json())
            .then(response => {
                const roomId = response.roomId;
                const socket = io.connect(`/${roomId}`);
                initializeGame(socket, roomId);
            });
    }

    initialize();
})();
