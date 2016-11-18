import { TEXT_STYLES } from 'constants';

export default class View {
    constructor(game) {
        this.game = game;
    }

    addText(width, height, text, style = TEXT_STYLES.SMALL_TEXT_FONT_STYLE, xAnchor = 0) {
        const textView = this.game.add.text(width, height, text, style);
        textView.anchor.setTo(xAnchor, 0.5);
        return textView;
    }
}
