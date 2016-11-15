import crypto from 'crypto';

const hosts = {};
const rooms = {};

function generateHostId() {
    const hostId = crypto.randomBytes(8).toString('hex');
    return !hosts[hostId] ? hostId : generateHostId();
}

// eslint-disable-next-line no-unused-vars
function addSection(roomId, section) {
    rooms[roomId][section] = true;
}

// eslint-disable-next-line no-unused-vars
function removeSection(roomId, section) {
    delete rooms[roomId][section];
}

// eslint-disable-next-line no-unused-vars
function removeHost(hostId) {
    delete hosts[hostId];
    delete rooms[hostId.substring(0, 4)];
}

export default {
    createHost() {
        const hostId = generateHostId();
        const roomId = hostId.substring(0, 4);

        hosts[hostId] = true;
        rooms[roomId] = {};

        return { hostId, roomId };
    },

    checkHostExists(hostId) {
        return !!hosts[hostId];
    },

    checkRoomExists(roomId) {
        return !!rooms[roomId];
    },
};
