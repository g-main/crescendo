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
            // Draw player information
            const globalGraphicLocation = (playerIndex * this.game.camera.width) / playerCount;
            const localGraphicOffset = this.game.camera.width / (playerCount * 2);

            // The number 5 below represents the # of lines per person.
            const localGraphicInitialHeight = (this.game.camera.height / 2) - (20 * 5);

            this.addText(
                globalGraphicLocation + localGraphicOffset,
                localGraphicInitialHeight,
                player.name,
                TEXT_STYLES.SMALL_TEXT_FONT_STYLE,
                0.5
            );

            this.addText(
                globalGraphicLocation + localGraphicOffset,
                localGraphicInitialHeight + 40,
                `MISS ${player.rawScore.numMiss}`,
                TEXT_STYLES.SMALL_TEXT_FONT_STYLE,
                0.5
            );

            this.addText(
                globalGraphicLocation + localGraphicOffset,
                localGraphicInitialHeight + 80,
                `GOOD ${player.rawScore.numGood}`,
                TEXT_STYLES.SMALL_TEXT_FONT_STYLE,
                0.5
            );

            this.addText(
                globalGraphicLocation + localGraphicOffset,
                localGraphicInitialHeight + 120,
                `EXCELLENT ${player.rawScore.numExcellent}`,
                TEXT_STYLES.SMALL_TEXT_FONT_STYLE,
                0.5
            );

            this.addText(
                globalGraphicLocation + localGraphicOffset,
                localGraphicInitialHeight + 160,
                `TOTAL ${player.score}`,
                TEXT_STYLES.SMALL_TEXT_FONT_STYLE,
                0.5
            );
        });
    }

    centerX(offset) {
        return (this.game.camera.width / 2) - offset;
    }
}
