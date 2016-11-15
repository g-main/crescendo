import { GAME_STATES } from 'constants';
import GameState from './GameState';
import TextStyles from './TextStyles';

export default class SummaryState extends GameState {
    create() {
        this.game.add.text(this.centerX(365), 50,
            'Game Summary', TextStyles.TITLE_FONT_STYLE);
        this.game.add.text(this.centerX(450), this.game.camera.height - 100,
            'Press R to start a new game or Q to exit', TextStyles.CALL_TO_ACTION_FONT_STYLE);

        this.game.input.keyboard.addKey(Phaser.Keyboard.R).onDown.addOnce(() => {
            this.game.state.start(GAME_STATES.JOIN);
        }, this);

        this.game.input.keyboard.addKey(Phaser.Keyboard.Q).onDown.addOnce(() => {
            this.game.state.start(GAME_STATES.MENU);
        }, this);
    }

    centerX(offset) {
        return (this.game.camera.width / 2) - offset;
    }
}
