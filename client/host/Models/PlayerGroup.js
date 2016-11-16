import Player from './Player';

export default class PlayerGroup {
    constructor() {
        this.players = {};
    }

    addPlayer(id, name, instrument) {
        if (this.players[id]) return;
        this.players[id] = new Player(id, name, instrument);
    }

    removePlayer(id) {
        if (!this.players[id]) return;
        delete this.players[id];
    }

    getPlayer(id) {
        return this.players[id];
    }

    forEach(callback) {
        Object.keys(this.players).forEach((key) => {
            callback(this.players[key]);
        });
    }

    getNumPlayers() {
        return Object.keys(this.players).length;
    }
}
