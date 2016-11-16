import { GAME_STATES, TEXT_STYLES, SOCKET_EVENTS } from 'constants';
import GameState from './GameState';
import PlayerGroup from '../Models/PlayerGroup';
import PlayerJoinPresenter from '../Presenters/PlayerJoinPresenter';

export default class JoinState extends GameState {
    constructor(game, roomId, socket) {
        super(game);
        this.initializeSocket(socket);
        this.songIndex = 0;
        this.roomId = roomId;
        this.songList = [];

        fetch('/api/v0/tracks', { method: 'GET' })
            .then(request => request.json())
            .then(response => {
                this.songList = response.tracks;
                this.songText = this.game.add.text(
                    this.game.camera.width / 2, 120,
                    this.songList[this.songIndex].name,
                    TEXT_STYLES.CALL_TO_ACTION_FONT_STYLE,
                ).anchor.setTo(0.5, 0.5);
            });

        this.playerGroup = new PlayerGroup();
        this.playerPresenter = new PlayerJoinPresenter(game, this.playerGroup);
    }

    initializeSocket(socket) {
        socket.on(SOCKET_EVENTS.JOIN_GAME, ({ id, name, instrument }) => {
            this.playerGroup.addPlayer(id, name, instrument);
            this.playerPresenter.render();
        });

        socket.on(SOCKET_EVENTS.LEFT_GAME, ({ id }) => {
            this.playerGroup.removePlayer(id);
            this.playerPresenter.render();
        });
    }

    create() {
        // Scroll through songs
        this.game.input.keyboard.addKey(Phaser.Keyboard.O).onDown.add(this.prevSong, this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.P).onDown.add(this.nextSong, this);

        // Start game on spae
        this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
            .onDown.addOnce(this.handleStart, this);

        // Room ID
        this.game.add.text(
            this.game.camera.width, 0,
            `Room ID: ${this.roomId}`,
            TEXT_STYLES.SMALL_TEXT_FONT_STYLE
        ).anchor.setTo(1, 0);

        // Select song text
        this.game.add.text(
            this.game.camera.width / 2, 60,
            'Select a Song:',
            TEXT_STYLES.TEXT_FONT_STYLE,
        ).anchor.setTo(0.5, 0.5);

        this.songText = this.game.add.text(
            this.game.camera.width / 2, 120,
            this.songList[this.songIndex].name,
            TEXT_STYLES.CALL_TO_ACTION_FONT_STYLE,
        );
        this.songText.anchor.setTo(0.5, 0.5);

        // Arrow keys to navigate (change song)
        this.game.add.text(
            this.game.camera.width / 4, 120,
            '<',
            TEXT_STYLES.CALL_TO_ACTION_FONT_STYLE,
        ).anchor.setTo(0.5, 0.5);

        this.game.add.text(
            this.game.camera.width / 4, 155,
            '(O)',
            TEXT_STYLES.SMALL_TEXT_FONT_STYLE,
        ).anchor.setTo(0.5, 0.5);

        this.game.add.text(
            (3 * this.game.camera.width) / 4, 120,
            '>',
            TEXT_STYLES.CALL_TO_ACTION_FONT_STYLE,
        ).anchor.setTo(0.5, 0.5);

        this.game.add.text(
            (3 * this.game.camera.width) / 4, 155,
            '(P)',
            TEXT_STYLES.SMALL_TEXT_FONT_STYLE,
        ).anchor.setTo(0.5, 0.5);

        this.game.add.text(
            this.game.camera.width / 2,
            this.game.camera.height - 50,
            'Press SPACE to start!',
            TEXT_STYLES.CALL_TO_ACTION_FONT_STYLE,
        ).anchor.setTo(0.5, 0.5);
    }

    handleStart() {
        const trackFile = this.songList[this.songIndex].file;
        fetch(`/api/v0/track/${trackFile}`, { method: 'GET' })
            .then(request => request.json())
            .then(response => {
                this.game.state.start(GAME_STATES.PLAY,
                    true,
                    false,
                    response,
                    this.playerGroup.getNumPlayers(),
                );
            });
    }

    nextSong() {
        this.songIndex = (this.songIndex + 1) % this.songList.length;
        this.songText.setText(this.songList[this.songIndex].name);
    }

    prevSong() {
        if ((--this.songIndex) < 0) {
            this.songIndex = this.songList.length - 1;
        }
        this.songText.setText(this.songList[this.songIndex].name);
    }
}
