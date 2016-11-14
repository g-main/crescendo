(function() {
    const GameState = require('./GameState.js');
    const SONGS = ["ODE TO JOY", "FAKE_SONG_2", "FAKE_SONG_3"];

    class JoinState extends GameState {

        constructor(game) {
            super(game);
            this.songIndex = 0;
        }

        create() {
            // Scroll through songs
            this.game.input.keyboard.addKey(Phaser.Keyboard.O).onDown.add(this.prevSong, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.P).onDown.add(this.nextSong, this);

            // Start game on spae
            this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(this.handleStart, this);
        }

        render() {
            this.game.debug.text('Use "O" and "P" keys to select a song.', 40, 100);
            this.game.debug.text(`Current Song: ${SONGS[this.songIndex]}`, 40, 140);

            this.game.debug.text('Press SPACE to start!', 40, this.game.camera.y + this.game.camera.height - 50);
        }

        handleStart() {
            this.game.state.start('Play');
        }

        nextSong() {
            this.songIndex  = ( this.songIndex + 1 ) % SONGS.length;
        }

        prevSong() {
            if ((--this.songIndex) < 0) {
                this.songIndex = SONGS.length - 1;
            }
        }
    }

    module.exports = JoinState;
})();
