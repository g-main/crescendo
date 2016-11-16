import { TEXT_STYLES } from 'constants';

export default class PlayerPresenter {
    constructor(game, playerGroup) {
        this.game = game;
        this.playerGroup = playerGroup;
        this.renderedPlayers = [];
    }

    notifyChanged() {
        // Remove rendered players that are no longer in the group
        this.renderedPlayers = this.renderedPlayers.filter(({player, card}) => {
            if (!this.playerGroup.getPlayer(player.id)) {
                card.destroy();
                return false;
            }
            return true;
        });

        // Render players that were just added into the group
        this.playerGroup.forEach((playerGroupPlayer) => {
            if (!this.renderedPlayers.find(({player}) => (player.id === playerGroupPlayer.id))) {
                this.renderedPlayers.push({
                    player: playerGroupPlayer,
                    card: this.renderPlayer(playerGroupPlayer),
                });
            }
        });

        // Update position of card on screen
        this.renderedPlayers.forEach(({card}, position) => {
            card.x = (position * 230) + (position * 20);
        });
    }

    renderPlayer(player) {
        const playerCard = this.game.add.group();
        const cardBackground = this.game.add.graphics(0, 0);
        cardBackground.beginFill(0xffffff, 1);
        cardBackground.drawRoundedRect(0, 0, 230, 256, 9);
        cardBackground.endFill();

        const instrument = this.game.add.image(20, 80, player.instrument);
        const playerNameText = this.game.add.text(0, 0, player.name, TEXT_STYLES.PLAYER_NAME_CARD);

        playerNameText.alignTo(instrument, Phaser.TOP_CENTER, 0, 20);
        playerCard.add(cardBackground);
        playerCard.add(instrument);
        playerCard.add(playerNameText);
        playerCard.y = 250;

        return playerCard;
    }
};
