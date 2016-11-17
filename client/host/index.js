import 'whatwg-fetch';
import io from 'socket.io-client';
import { GAME_STATES } from 'constants';
import MenuState from './States/MenuState';
import JoinState from './States/JoinState';
import PlayState from './States/PlayState';
import LoadState from './States/LoadState';
import SummaryState from './States/SummaryState';
import PlayerGroup from './Models/PlayerGroup';

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
        const playerGroup = new PlayerGroup();

        game.state.add(GAME_STATES.LOAD, new LoadState(game));
        game.state.add(GAME_STATES.PLAY, new PlayState(game, socket, playerGroup));
        game.state.add(GAME_STATES.JOIN, new JoinState(game, roomId, socket, playerGroup));
        game.state.add(GAME_STATES.MENU, new MenuState(game));
        game.state.add(GAME_STATES.SUMMARY, new SummaryState(game, playerGroup));

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
