import { GAME_STATES, INSTRUMENTS } from 'constants';
import GameState from './GameState';

export default class LoadState extends GameState {
    preload() {
        this.game.load.image(INSTRUMENTS.DRUMS, 'assets/img/drums.png');
    }

    create() {
        this.game.state.start(GAME_STATES.MENU);
    }
}
