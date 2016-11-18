import { GAME_STATES, TEXT_STYLES } from 'constants';
import GameState from './GameState';

export default class SummaryState extends GameState {
    constructor(game, playerGroup) {
        super(game);
        this.playerGroup = playerGroup;
    }

    create() {
        this.game.add.text(this.centerX(365), 50,
            'Game Summary', TEXT_STYLES.TITLE_FONT_STYLE);
        this.game.add.text(this.centerX(450), this.game.camera.height - 100,
            'Press R to start a new game or Q to exit', TEXT_STYLES.CALL_TO_ACTION_FONT_STYLE);

        this.game.input.keyboard.addKey(Phaser.Keyboard.R).onDown.addOnce(() => {
            this.playerGroup.resetScores();
            this.game.state.start(GAME_STATES.JOIN);
        }, this);

        this.game.input.keyboard.addKey(Phaser.Keyboard.Q).onDown.addOnce(() => {
            this.playerGroup.clear();
            this.game.state.start(GAME_STATES.MENU);
        }, this);
    }

    centerX(offset) {
        return (this.game.camera.width / 2) - offset;
    }
}
