import { TEXT_STYLES } from 'constants';
import View from './View';

export default class SummaryView extends View {
    constructor(game, playerGroup, song) {
        super(game);
        this.playerGroup = playerGroup;
        this.song = song;
        this.scoreViews = [];
    }

    initialize() {
        const playerCount = this.playerGroup.getNumPlayers();

        this.game.add.text(this.centerX(365), 50,
            'Game Summary', TEXT_STYLES.TITLE_FONT_STYLE);
        this.game.add.text(this.centerX(450), this.game.camera.height - 100,
            'Press R to start a new game or Q to exit', TEXT_STYLES.CALL_TO_ACTION_FONT_STYLE);

        this.playerGroup.forEach((player, playerIndex) => {
            let stringValues = [
                player.name,
            ];

            stringValues = stringValues.concat(Object.keys(player.rawScore.types)
                .map(type => `${type}: ${player.rawScore.scores[type]}`));
            stringValues.push(`TOTAL: ${player.score}`);

            // Draw player information
            const textHeight = 40;
            const globalGraphicLocation = (playerIndex * this.game.camera.width) / playerCount;
            const localGraphicOffset = this.game.camera.width / (playerCount * 2);
            const localGraphicInitialHeight = (this.game.camera.height / 2)
                - ((textHeight / 2) * stringValues.length);


            stringValues.forEach((str, index) => {
                this.addText(
                    globalGraphicLocation + localGraphicOffset,
                    localGraphicInitialHeight + (textHeight * index),
                    str,
                    TEXT_STYLES.SMALL_TEXT_FONT_STYLE,
                    0.5
                );
            });
        });
    }

    centerX(offset) {
        return (this.game.camera.width / 2) - offset;
    }
}
