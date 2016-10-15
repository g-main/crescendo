(function() {
    const GameState = require('./GameState.js');

    class PlayState extends GameState {

        _goFull() {
            if (this.game.isFullScreen) {
                this.game.scale.stopFullScreen();
            } else {
                this.game.scale.startFullScreen(false);
            }
        }

        preload() {
            // Load assets
        }

        create() {
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

            const text = "Phaser Version "+ Phaser.VERSION + " works!";
            const style = { font: "24px Arial", fill: "#fff", align: "center" };
            const t = this.game.add.text(this.world.centerX, this.world.centerY, text, style);
            t.anchor.setTo(0.5, 0.5);

            this.game.input.onDown.add(this._goFull, this);
        }

        update() {
            // no-op
        }

        render() {
            // Debug / text
            this.game.debug.cameraInfo(this.game.camera, 32, 32);
        }
    }

    module.exports = PlayState;
})();
