import path from 'path';
import room from '../lib/room';

export default {
    get(req, res) {
        if (room.checkRoomExists(req.url.split('/')[1].toLowerCase())) {
            res.sendFile(path.join(__dirname, '..', '..', 'build', 'user.html'));
        } else {
            res.redirect('/');
        }
    },
};
