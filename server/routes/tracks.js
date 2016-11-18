import track from '../lib/tracks';

export default {
    getTracks(req, res) {
        res.json({ tracks: track.getTracks() });
    },

    getTrack(req, res) {
        res.json(track.getTrack(req.params.trackFile));
    },
};
