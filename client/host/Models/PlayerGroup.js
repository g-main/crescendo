import Player from './Player';

export default class PlayerGroup {
    constructor() {
        this.clear();
    }

    exists(id) {
        return !!this.getById(id);
    }

    getById(id) {
        return this.players.find(player => player.id === id);
    }

    getByIndex(index) {
        return this.players[index];
    }

    addPlayer(id, name, instrument, calibration) {
        if (this.exists(id)) return;
        this.players.push(new Player(id, name, instrument, calibration));
    }

    removePlayer(id) {
        if (!this.exists(id)) return;
        this.players.splice(this.players.findIndex(player => player.id === id), 1);
    }

    forEach(callback) {
        this.players.forEach(callback);
    }

    getNumPlayers() {
        return this.players.length;
    }

    resetScores() {
        this.forEach(player => { player.resetScore(); });
    }

    clear() {
        this.players = [];
    }
}
