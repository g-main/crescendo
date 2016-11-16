import { GAME_STATES, INSTRUMENTS, TEXT_STYLES } from 'constants';
import GameState from './GameState';

export default class JoinState extends GameState {
    constructor(game, roomId) {
        super(game);
        this.songIndex = 0;
        this.roomId = roomId;
        this.playerCount = 0;
        this.songList = [];

        fetch('/api/v0/tracks', { method: 'GET' })
            .then(request => request.json())
            .then(response => {
                this.songList = response.tracks;
            });
    }

    create() {
        // Scroll through songs
        this.game.input.keyboard.addKey(Phaser.Keyboard.O).onDown.add(this.prevSong, this);
        this.game.input.keyboard.addKey(Phaser.Keyboard.P).onDown.add(this.nextSong, this);

        // Start game on spae
        this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
            .onDown.addOnce(this.handleStart, this);

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

    render() {
        this.game.debug.text('Use "O" and "P" keys to select a song.', 40, 100);
        this.game.debug.text(`Current Song: ${this.songList[this.songIndex].name}`, 40, 140);
        this.game.debug.text(`Room Id: ${this.roomId}`, 40, 180);
        this.game.debug.text(
            'Press SPACE to start!',
            40,
            (this.game.camera.y + this.game.camera.height) - 50
        );
    }

    handleStart() {
        const trackFile = this.songList[this.songIndex].file;
        fetch(`/api/v0/track/${trackFile}`, { method: 'GET' })
            .then(request => request.json())
            .then(response => {
                this.game.state.start(GAME_STATES.PLAY, false, false, response);
            });
    }

    nextSong() {
        this.songIndex = (this.songIndex + 1) % this.songList.length;
    }

    prevSong() {
        if ((--this.songIndex) < 0) {
            this.songIndex = this.songList.length - 1;
        }
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
