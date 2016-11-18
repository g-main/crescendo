import fs from 'fs';
import path from 'path';
import { TRACK_EXTENSION } from '../../shared/constants.js';

const tracksPath = path.resolve(__dirname, '..', '..', 'shared', 'tracks');

export default {
    getTracks() {
        const trackList = [];

        fs.readdirSync(tracksPath)
            .filter(file => path.extname(file) === TRACK_EXTENSION)
            .forEach(file => {
                const trackPath = path.resolve(tracksPath, file);
                const { name, difficulty, artist } = JSON.parse(fs.readFileSync(trackPath, 'utf8'));
                trackList.push({ file, name, difficulty, artist });
            });

        return trackList;
    },

    getTrack(file) {
        const trackPath = path.resolve(tracksPath, file);
        return JSON.parse(fs.readFileSync(trackPath, 'utf8'));
    },
};
