const
    debug = require('debug')('crescendo:room'),
    crypto = require('crypto');

let hosts = {},
    rooms = {};

module.exports = {
    createHost: createHost,
    checkHostExists: checkHostExists,
    checkRoomExists: checkRoomExists
};

function generateHostId() {
    let hostId;

    try {
        hostId = crypto.randomBytes(8).toString('hex');
        if (hosts[hostId]) throw 'Exists already!';
    } catch (err) {
        hostId = generateHostId();
    }

    return hostId;
}

function createHost() {
    let hostId = generateHostId(),
        roomId = hostId.substring(0,4);

    hosts[hostId] = true;
    rooms[roomId] = {};

    return { hostId: hostId, roomId: roomId };
}

function addSection(roomId, section) {
    rooms[roomId][section] = true;
}

function removeSection(roomId, section) {
    delete rooms[roomId][section];
}

function checkRoomExists(roomId) {
    return !!rooms[roomId];
}

function removeHost(hostId) {
    delete hosts[hostId];
    delete rooms[hostId.substring(0,4)];
}

function checkHostExists(hostId) {
    return !!hosts[hostId];
}
