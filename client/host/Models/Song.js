import Track from './Track';

export default class Song {
    constructor(song) {
        this._name = song.name;
        this._file = song.file;
        this._difficulty = song.difficulty;
        this._artist = song.artist;
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

    get difficulty() {
        return this._difficulty;
    }
}
