import { GAME_STATES, TEXT_STYLES } from 'constants';
import GameState from './GameState';

export default class MenuState extends GameState {
    create() {
        function addText(game, height, text) {
            return game.add.text(game.camera.width / 2, height, text,
                TEXT_STYLES.TEXT_FONT_STYLE).anchor.setTo(0.5, 0.5);
        }

        this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
            .onDown.addOnce(() => this.game.state.start(GAME_STATES.JOIN), this);

        addText(this.game, 50, 'Crescendo');
        addText(this.game, 300, 'An SE 464 Project made by:');
        addText(this.game, 370, 'Sameer Chitley, Jami Boy Mohammad, Hasya Shah, and Geoffrey Yu');

        this.game.add.text(
            this.game.camera.width / 2,
            this.game.camera.height - 50,
            'Press ENTER to start!',
            TEXT_STYLES.CALL_TO_ACTION_FONT_STYLE
        ).anchor.setTo(0.5, 0.5);
    }
}
