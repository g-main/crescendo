import { TEXT_STYLES } from 'constants';

const CARD_WIDTH = 230;
const CARD_HEIGHT = 256;
const CARD_MARGIN = 20;

export default class PlayerCardsView {
    constructor(game, playerGroup) {
        this.game = game;
        this.playerGroup = playerGroup;
        this.renderedPlayers = [];
    }

    onModelChange() {
        // Remove rendered players that are no longer in the group
        this.renderedPlayers = this.renderedPlayers.filter(({ player, card }) => {
            if (!this.playerGroup.getById(player.id)) {
                card.destroy();
                return false;
            }
            return true;
        });

        // Render players that were just added into the group
        this.playerGroup.forEach((playerGroupPlayer) => {
            if (!this.renderedPlayers.find(({ player }) => (player.id === playerGroupPlayer.id))) {
                this.renderedPlayers.push({
                    player: playerGroupPlayer,
                    card: this.renderPlayerCard(playerGroupPlayer),
                });
            }
        });

        // Update position of cards on screen
        const cardsWidth = ((CARD_WIDTH + CARD_MARGIN) * this.renderedPlayers.length) - CARD_MARGIN;
        const startFrom = (this.game.world.width - cardsWidth) / 2;
        this.renderedPlayers.forEach(({ card }, position) => {
            // eslint-disable-next-line no-param-reassign
            card.x = startFrom + (position * CARD_WIDTH) + (position * CARD_MARGIN);
        });
    }

    renderPlayerCard(player) {
        const playerCard = this.game.add.group();
        const cardBackground = this.game.add.graphics(0, 0);
        cardBackground.beginFill(0xffffff, 1);
        cardBackground.drawRoundedRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 9);
        cardBackground.endFill();

        const instrumentImage = this.game.add.image(CARD_WIDTH / 2, CARD_MARGIN * 4,
                                                    player.instrument);
        const playerNameText = this.game.add.text(CARD_WIDTH / 2, CARD_MARGIN,
                                                  player.name,
                                                  TEXT_STYLES.PLAYER_NAME_CARD);

        playerCard.add(cardBackground);
        playerCard.add(instrumentImage);
        playerCard.add(playerNameText);
        playerCard.y = ((this.game.world.height - CARD_HEIGHT) / 2) + 30;
        playerNameText.anchor.x = 0.5;
        instrumentImage.anchor.x = 0.5;

        return playerCard;
    }
}
