import debugModule from 'debug';
import express from 'express';
import http from 'http';
import path from 'path';

import Socket from './server/socket';
import Room from './server/room';

(() => {
    const app = express();
    const httpServer = http.createServer(app);
    const apiRouter = express.Router(); // eslint-disable-line
    const debug = debugModule('crescendo:socket');

    const socket = new Socket(httpServer);
    const room = new Room();

    app.use('/assets', express.static('./dist/assets'));
    app.use('/lib', express.static('./dist/lib'));
    app.use('/js', express.static('./dist/js'));

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, './dist/host.html'));
    });

    app.get(/^\/[a-fA-F0-9]{4}\/?$/, (req, res) => {
        if (room.checkRoomExists(req.url.split('/')[1].toLowerCase())) {
            res.sendFile(path.join(__dirname, './dist/user.html'));
        } else {
            res.redirect('/');
        }
    });

    apiRouter.get('/create', (req, res) => {
        const host = room.createHost();
        socket.createNamespace(host.roomId);
        res.json(host);
    });

    app.use('/api/v0', apiRouter);

    httpServer.listen(3000, () => {
        debug('OMG! Server is up!');
    });
})();
