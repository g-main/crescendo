import socket from '../lib/socket';
import room from '../lib/room';

export default {
    get(req, res) {
        const host = room.createHost();
        socket.createNamespace(host.roomId);
        res.json(host);
    },
};
