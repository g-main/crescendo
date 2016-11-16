import debugModule from 'debug';
import express from 'express';
import http from 'http';

import socket from './server/lib/socket';

import index from './server/routes/index';
import join from './server/routes/join';
import create from './server/routes/create';
import tracks from './server/routes/tracks';

(() => {
    const app = express();
    const httpServer = http.createServer(app);
    const apiRouter = express.Router(); // eslint-disable-line new-cap
    const debug = debugModule('crescendo:socket');

    // Initialize socket
    socket.initialize(httpServer);

    // Initialize Assets
    app.use('/assets', express.static('./build/assets'));
    app.use('/tracks', express.static('./shared/tracks'));
    app.use('/js', express.static('./build/js'));

    // Initialize Client Routes
    app.get('/', index.get);
    app.get(/^\/[a-fA-F0-9]{4}\/?$/, join.get);

    // Initialize API Routes
    apiRouter.get('/create', create.get);
    apiRouter.get('/tracks', tracks.getTracks);
    apiRouter.get('/track/:trackFile', tracks.getTrack);
    app.use('/api/v0', apiRouter);

    // Initialize Server
    httpServer.listen(3000, () => {
        debug('OMG! Server is up!');
    });
})();
