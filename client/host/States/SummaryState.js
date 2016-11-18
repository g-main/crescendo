import { GAME_STATES } from 'constants';
import GameState from './GameState';
import SummaryView from '../Views/SummaryView';

export default class SummaryState extends GameState {
    constructor(game, playerGroup) {
        super(game);
        this.playerGroup = playerGroup;
    }

    init(song) {
        this.song = song;
    }

    create() {
        const summaryView = new SummaryView(this.game, this.playerGroup, this.song);
        summaryView.initialize();

        this.game.input.keyboard.addKey(Phaser.Keyboard.R).onDown.addOnce(() => {
            this.playerGroup.resetScores();
            this.game.state.start(GAME_STATES.JOIN);
        }, this);

        this.game.input.keyboard.addKey(Phaser.Keyboard.Q).onDown.addOnce(() => {
            this.playerGroup.clear();
            this.game.state.start(GAME_STATES.MENU);
        }, this);
    }
}
