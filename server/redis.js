import debugModule from 'debug';
import redis from 'redis';

const debug = debugModule('crescendo:socket');

export default class Redis {
    static redisClient = null;
    getClass() {
        if (!Redis.redisClient) {
            Redis.redisClient = redis.createClient();
            Redis.redisClient.on('error', (error) => debug(error));
        }
        return Redis.redisClient;
    }
}
