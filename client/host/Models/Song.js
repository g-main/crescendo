import Track from './Track';

export default class Song {
    constructor(song) {
        this._name = song.name;
        this._file = song.file;
        this._tracks = {};
        Object.keys(song.track).forEach(instrument => {
            this._tracks[instrument] = new Track(instrument, song.track[instrument]);
        });
    }

    get file() {
        return this._file;
    }

    getTrack(type) {
        return this._tracks[type];
    }
}
