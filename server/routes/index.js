import path from 'path';

export default {
    get(req, res) {
        res.sendFile(path.join(__dirname, '..', '..', 'build', 'host.html'));
    },
};
