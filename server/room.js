import crypto from 'crypto';

export default class Room {
    constructor() {
        this.hosts = {};
        this.rooms = {};
    }

    createHost() {
        const hostId = this._generateHostId();
        const roomId = hostId.substring(0, 4);

        this.hosts[hostId] = true;
        this.rooms[roomId] = {};

        return { hostId, roomId };
    }

    checkHostExists(hostId) {
        return !!this.hosts[hostId];
    }

    checkRoomExists(roomId) {
        return !!this.rooms[roomId];
    }

    _generateHostId() {
        const hostId = crypto.randomBytes(8).toString('hex');
        return !this.hosts[hostId] ? hostId : this._generateHostId();
    }

    _addSection(roomId, section) {
        this.rooms[roomId][section] = true;
    }

    _removeSection(roomId, section) {
        delete this.rooms[roomId][section];
    }

    _removeHost(hostId) {
        delete this.hosts[hostId];
        delete this.rooms[hostId.substring(0, 4)];
    }
}
