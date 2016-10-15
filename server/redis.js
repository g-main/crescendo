const
    debug = require('debug')("spotlightbling:redis"),
    redis = require('redis');

let redisClient;

module.exports = {
    getClient: function() {
        if (!redisClient) {
            redisClient = redis.createClient();
            redisClient.on("error", function (error) {
                debug(error);
            });
        }
        return redisClient;
    }
};
