import { GAME_STATES, INSTRUMENTS } from 'constants';
import GameState from './GameState';

export default class LoadState extends GameState {
    preload() {
        this.game.load.image(INSTRUMENTS.DRUMS, 'assets/img/drums.png');
        this.game.load.image(INSTRUMENTS.GUITAR, 'assets/img/guitar.png');
        this.game.load.image(`${INSTRUMENTS.DRUMS}_white`, 'assets/img/drums_white.png');
        this.game.load.image(`${INSTRUMENTS.GUITAR}_white`, 'assets/img/guitar_white.png');
    }

    create() {
        this.game.state.start(GAME_STATES.MENU);
    }
}
