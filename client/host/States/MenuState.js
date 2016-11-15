import { GAME_STATES, TEXT_STYLES } from 'constants';
import GameState from './GameState';

export default class MenuState extends GameState {
    create() {
        this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
            .onDown.addOnce(this.handleStart, this);

        this.game.add.text(this.centerX(240), 50,
            'Crescendo', TEXT_STYLES.TITLE_FONT_STYLE);
        this.game.add.text(this.centerX(252), 300,
            'An SE 464 Project made by:', TEXT_STYLES.TEXT_FONT_STYLE);
        this.game.add.text(this.centerX(575), 370,
            'Sameer Chitley, Jami Boy Mohammad, Hasya Shah, Geoffrey Yu',
            TEXT_STYLES.TEXT_FONT_STYLE);
        this.game.add.text(this.centerX(245), this.game.camera.height - 150,
            'Press ENTER to start!', TEXT_STYLES.CALL_TO_ACTION_FONT_STYLE);
    }

    handleStart() {
        this.game.state.start(GAME_STATES.JOIN);
    }

    centerX(offset) {
        return (this.game.camera.width / 2) - offset;
    }
}
