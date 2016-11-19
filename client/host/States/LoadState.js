import {
    GAME_STATES,
    INSTRUMENTS,
    TEXT_STYLES,
 } from 'constants';
import GameState from './GameState';

export default class LoadState extends GameState {

    constructor(game) {
        super(game);
        this.anims = [];
        this.completedAnimations = 0;
    }

    _start() {
        this.game.load.image(INSTRUMENTS.DRUMS, 'assets/img/drums.png');
        this.game.load.image(INSTRUMENTS.GUITAR, 'assets/img/guitar.png');
        this.game.load.image(`${INSTRUMENTS.DRUMS}_white`, 'assets/img/drums_white.png');
        this.game.load.image(`${INSTRUMENTS.GUITAR}_white`, 'assets/img/guitar_white.png');

        this.game.load.start();
    }

    create() {
        this._create();
        this._start();
    }

    _create() {
        const load = this.game.load;
        load.onLoadComplete.add(this._loadComplete.bind(this), this);

        const { font } = TEXT_STYLES.TITLE_FONT_STYLE;
        const offset = parseInt(font.substr(0, font.indexOf('px')), 10);
        const loadingText = this.game.add.text(
            this.game.camera.width / 2,
            (this.game.camera.height / 2) + offset,
            'Loading...',
            TEXT_STYLES.TEXT_FONT_STYLE,
        );
        loadingText.anchor.setTo(0.5, 0.5);
        this.anims.push(this.game.add.tween(loadingText)
                                        .to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, false));

        const titleText = this.game.add.text(
            this.game.camera.width / 2,
            this.game.camera.height / 2,
            'Crescendo',
            TEXT_STYLES.TITLE_FONT_STYLE,
        );
        titleText.anchor.setTo(0.5, 0.5);
        this.anims.push(this.game.add.tween(titleText)
                                        .to({ y: 80 }, 1000, Phaser.Easing.Linear.None, false));
    }

    _loadComplete() {
        if (this.anims.length === 0) {
            this._transitionState();
            return;
        }
        this.anims.forEach((anim, animIndex) => {
            anim.onComplete.add(this._animationComplete.bind(this), this);
            if (animIndex + 1 < this.anims.length) {
                anim.onComplete.add(() => { this.anims[animIndex + 1].start(); }, this);
            }
        });
        this.anims[0].start();
    }

    _animationComplete() {
        if (++this.completedAnimations === this.anims.length) {
            this._transitionState();
        }
    }

    _transitionState() {
        this.game.state.start(GAME_STATES.MENU);
    }
}
