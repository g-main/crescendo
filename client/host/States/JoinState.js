import { GAME_STATES, INSTRUMENTS, TEXT_STYLES } from 'constants';
import GameState from './GameState';

const SONGS = ['Ode to Joy', 'Fake Song', 'Another Fake Song'];

export default class JoinState extends GameState {
    constructor(game, roomId) {
        super(game);
        this.songIndex = 0;
        this.roomId = roomId;
        this.playerCount = 0;
        this.songText = SONGS[this.songIndex];
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

        this.game.input.keyboard.addKey(Phaser.Keyboard.A)
            .onDown.add(() => {
                this.renderPlayer(
                    `Player ${this.playerCount + 1}`,
                    INSTRUMENTS.DRUMS,
                    (this.playerCount * 230) + (20 * this.playerCount),
                    200);
                this.playerCount++;
            }, this);
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

    renderPlayer(name, type, x, y) {
        const playerCard = this.game.add.group();
        const cardBackground = this.game.add.graphics(0, 0);
        cardBackground.beginFill(0xffffff, 1);
        cardBackground.drawRoundedRect(0, 0, 230, 256, 9);
        cardBackground.endFill();

        const instrument = this.game.add.image(20, 80, type);
        const playerNameText = this.game.add.text(0, 0, name, TEXT_STYLES.PLAYER_NAME_CARD);

        playerNameText.alignTo(instrument, Phaser.TOP_CENTER, 0, 20);
        playerCard.add(cardBackground);
        playerCard.add(instrument);
        playerCard.add(playerNameText);
        playerCard.x = x;
        playerCard.y = y;

        return playerCard;
    }
}
