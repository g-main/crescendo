import { GAME_STATES, TEXT_STYLES } from 'constants';
import GameState from './GameState';

export default class MenuState extends GameState {
    create() {
        const addText = (game, height, text, style = TEXT_STYLES.TEXT_FONT_STYLE) =>
            game.add.text(game.camera.width / 2, height, text, style)
                    .anchor.setTo(0.5, 0.5);

        this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
            .onDown.addOnce(() => { this.game.state.start(GAME_STATES.JOIN); }, this);

        addText(this.game, 80, 'Crescendo', TEXT_STYLES.TITLE_FONT_STYLE);
        addText(this.game, (this.game.camera.height / 2) - 50, 'An SE 464 Project made by:');
        addText(
            this.game,
            (this.game.camera.height / 2) + 20,
            'Sameer Chitley, Jami Boy Mohammad, Hasya Shah, and Geoffrey Yu',
        );

        addText(
            this.game,
            this.game.camera.height - 50,
            'Press ENTER to start!',
            TEXT_STYLES.CALL_TO_ACTION_FONT_STYLE,
        );
    }
}
