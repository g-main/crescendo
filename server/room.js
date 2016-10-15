const
    debug = require('debug')('spotlightbling:room'),
    crypto = require('crypto'),
    redis = require('./redis'),
    redisClient = redis.getClient();

module.exports = {
    createRoom: createRoom,
    getRedisKey: getRedisKey,
    checkHostExists: checkHostExists,
    checkRoomExists: checkRoomExists
};

function generateHostId() {
    let hostId;

    try {
        hostId = crypto.randomBytes(8).toString('hex');
    } catch (err) {
        hostId = generateHostId();
    }

    return hostId;
}

function getRedisKey(roomId) {
    return 'room:' + roomId;
}

function createRoom(callback) {
    let hostId = generateHostId();
    let roomId = hostId.substring(0,4);
    addHost(hostId, function (error) {
        if (error) {
            debug("Error adding hostId to redis");
            callback && callback(error);
        } else {
            redisClient.sadd("rooms", roomId, function (error, reply) {
                if (error || !reply) {
                    debug(error);
                    callback && callback(error);
                } else {
                    callback && callback(null, { roomId: roomId, hostId: hostId });
                }
            });
        }
    });
}

function removeRoom(roomId, callback) {
    redisClient.srem('rooms', roomId, function (err, reply) {
        if (err || !reply) {
            debug(err || 'Uh oh. Did not receive a reply from Redis.');
        }
        callback && callback(err);
    });
}

function addSection(roomId, section, callback) {
    redisClient.sadd(roomId, section, function (err, reply) {
        if (err || !reply) {
            debug(err || 'Uh oh. Did not receive a reply from Redis.');
        }
        callback && callback(err);
    });
}

function removeSection(roomId, section, callback) {
    redisClient.srem(roomId, section, function (err, reply) {
        if (err || !reply) {
            debug(err || 'Uh oh. Did not receive a reply from Redis.');
        }
        callback && callback(err);
    });
}

function checkRoomExists(roomId, callback) {
    redisClient.sismember('rooms', roomId, function (error, reply) {
        if (error || !reply) {
            debug(error);
            callback && callback(error, false);
        } else {
            callback && callback(null, true);
        }
    });
}

function addHost(hostId, callback) {
    redisClient.sadd('hosts', hostId, function (error, reply) {
        if (error || !reply) {
            debug(error);
        }
        callback && callback(error);
    });
}

function removeHost(hostId, callback) {
    redisClient.srem("hosts", hostId, function (error, reply) {
        if (error || !reply) {
            debug(error);
            callback && callback(error);
        }
    });
}

function checkHostExists(hostId, callback) {
    redisClient.sismember('hosts', hostId, function (error, reply) {
        if (error || !reply) {
            debug(error);
            callback && callback(error, false);
        } else {
            callback && callback(null, true);
        }
    });
}
