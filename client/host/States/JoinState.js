import { GAME_STATES, INSTRUMENTS, TEXT_STYLES, SOCKET_EVENTS } from 'constants';
import GameState from './GameState';
import PlayerGroup from '../Models/PlayerGroup';
import PlayerJoinPresenter from '../Presenters/PlayerJoinPresenter';

const SONGS = ['Ode to Joy', 'Fake Song', 'Another Fake Song'];

export default class JoinState extends GameState {
    constructor(game, roomId, socket) {
        super(game);
        this.initializeSocket(socket);
        this.songIndex = 0;
        this.roomId = roomId;
        this.songText = SONGS[this.songIndex];
        this.playerGroup = new PlayerGroup();
        this.playerPresenter = new PlayerJoinPresenter(game, this.playerGroup);
    }

    initializeSocket(socket) {
        socket.on(SOCKET_EVENTS.JOIN_GAME, ({id, name, instrument}) => {
            this.playerGroup.addPlayer(id, name, instrument);
            this.playerPresenter.notifyChanged();
        });

        socket.on(SOCKET_EVENTS.LEFT_GAME, ({id}) => {
            this.playerGroup.removePlayer(id);
            this.playerPresenter.notifyChanged();
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
            (7 * this.game.camera.width) / 8,
            30,
            `Room ID: ${this.roomId}`,
            TEXT_STYLES.SMALL_TEXT_FONT_STYLE,
        ).anchor.setTo(0, 0.5);

        // Select song text
        this.game.add.text(
            this.game.camera.width / 2,
            60,
            'Select a Song:',
            TEXT_STYLES.TEXT_FONT_STYLE,
        ).anchor.setTo(0.5, 0.5);
        this.songText = this.game.add.text(
            this.game.camera.width / 2,
            120,
            SONGS[this.songIndex],
            TEXT_STYLES.CALL_TO_ACTION_FONT_STYLE,
        );
        this.songText.anchor.setTo(0.5, 0.5);

        // Arrow keys to navigate (change song)
        this.game.add.text(
            this.game.camera.width / 4,
            120,
            '<',
            TEXT_STYLES.CALL_TO_ACTION_FONT_STYLE,
        ).anchor.setTo(0.5, 0.5);
        this.game.add.text(
            this.game.camera.width / 4,
            155,
            '(O)',
            TEXT_STYLES.SMALL_TEXT_FONT_STYLE,
        ).anchor.setTo(0.5, 0.5);
        this.game.add.text(
            (3 * this.game.camera.width) / 4,
            120,
            '>',
            TEXT_STYLES.CALL_TO_ACTION_FONT_STYLE,
        ).anchor.setTo(0.5, 0.5);
        this.game.add.text(
            (3 * this.game.camera.width) / 4,
            155,
            '(P)',
            TEXT_STYLES.SMALL_TEXT_FONT_STYLE,
        ).anchor.setTo(0.5, 0.5);

        // Play Game text!
        this.game.add.text(
            this.game.camera.width / 2,
            this.game.camera.height - 50,
            'Press SPACE to start!',
            TEXT_STYLES.CALL_TO_ACTION_FONT_STYLE,
        ).anchor.setTo(0.5, 0.5);
    }

    handleStart() {
        this.game.state.start(GAME_STATES.PLAY);
    }

    nextSong() {
        this.songIndex = (this.songIndex + 1) % SONGS.length;
        this.updateSongText();
    }

    prevSong() {
        if ((--this.songIndex) < 0) {
            this.songIndex = SONGS.length - 1;
        }
        this.updateSongText();
    }

    updateSongText() {
        this.songText.setText(SONGS[this.songIndex]);
    }
}
