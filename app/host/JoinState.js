(function() {
    const GameState = require('./GameState.js');
    const TextStyles = require('./TextStyles.js');
    const {GAME_STATES, INSTRUMENTS} = require('../../constants.js');
    const SONGS = ["ODE TO JOY", "FAKE_SONG_2", "FAKE_SONG_3"];
    let p = 0;

    class JoinState extends GameState {

        constructor(game, roomId, socket) {
            super(game);
            this.initializeSocket(socket);
            this.songIndex = 0;
            this.roomId = roomId;
        }

        initializeSocket(socket) {
        }

        create() {
            // Scroll through songs
            this.game.input.keyboard.addKey(Phaser.Keyboard.O).onDown.add(this.prevSong, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.P).onDown.add(this.nextSong, this);

            // Start game on spae
            this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(this.handleStart, this);

            this.game.input.keyboard.addKey(Phaser.Keyboard.A).onDown.add(() => {
                this.renderPlayer('Player ' + (p + 1), INSTRUMENTS.DRUMS, p * 230 + 20 * p, 200);
                p++;
            }, this);
        }

        render() {
            this.game.debug.text('Use "O" and "P" keys to select a song.', 40, 100);
            this.game.debug.text(`Current Song: ${SONGS[this.songIndex]}`, 40, 140);
            this.game.debug.text(`Room Id: ${this.roomId}`, 40, 180);

            this.game.debug.text('Press SPACE to start!', 40, this.game.camera.y + this.game.camera.height - 50);
        }

        handleStart() {
            this.game.state.start(GAME_STATES.PLAY);
        }

        nextSong() {
            this.songIndex  = ( this.songIndex + 1 ) % SONGS.length;
        }

        prevSong() {
            if ((--this.songIndex) < 0) {
                this.songIndex = SONGS.length - 1;
            }
        }

        renderPlayer(name, type, x, y) {
            const playerCard = this.game.add.group();
            const cardBackground = this.game.add.graphics(0, 0);
            cardBackground.beginFill(0xffffff, 1);
            cardBackground.drawRoundedRect(0, 0, 230, 256, 9);
            cardBackground.endFill();

            const instrument = this.game.add.image(20, 80, type);
            const playerNameText = this.game.add.text(0, 0, name, TextStyles.PLAYER_NAME_CARD);

            playerNameText.alignTo(instrument, Phaser.TOP_CENTER, 0, 20);
            playerCard.add(cardBackground);
            playerCard.add(instrument);
            playerCard.add(playerNameText);
            playerCard.x = x;
            playerCard.y = y;

            return playerCard;
        }
    }

    module.exports = JoinState;
})();
