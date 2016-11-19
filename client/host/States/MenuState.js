import { GAME_STATES, TEXT_STYLES } from 'constants';
import GameState from './GameState';

const addText = (game, height, text, style = TEXT_STYLES.TEXT_FONT_STYLE) => {
    const newText = game.add.text(game.camera.width / 2, height, text, style);
    newText.anchor.setTo(0.5, 0.5);
    return newText;
};

export default class MenuState extends GameState {
    create() {
        this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
            .onDown.addOnce(() => { this.game.state.start(GAME_STATES.JOIN); }, this);

        addText(this.game, 80, 'Crescendo', TEXT_STYLES.TITLE_FONT_STYLE);
        const madeByText1 = addText(
            this.game,
            (this.game.camera.height / 2) - 50,
            'An SE 464 Project made by:',
        );
        const madeByText2 = addText(
            this.game,
            (this.game.camera.height / 2) + 20,
            'Sameer Chitley, Jami Boy Mohammad, Hasya Shah, and Geoffrey Yu',
        );
        madeByText1.alpha = 0;
        madeByText2.alpha = 0;
        this.anims.push(
            this.game.add.tween(madeByText1)
                            .to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, false)
        );
        this.anims.push(
            this.game.add.tween(madeByText2)
                            .to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, false)
        );

        addText(
            this.game,
            this.game.camera.height - 50,
            'Press ENTER to start!',
            TEXT_STYLES.CALL_TO_ACTION_FONT_STYLE,
        );

        this._startAnimation();
    }

    _startAnimation() {
        if (this.anims.length === 0) {
            return;
        }
        this.anims.forEach((anim, animIndex) => {
            if (animIndex + 1 < this.anims.length) {
                anim.onComplete.add(() => { this.anims[animIndex + 1].start(); }, this);
            }
        });
        this.anims[0].start();
    }
}
