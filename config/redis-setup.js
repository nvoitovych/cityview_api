const redis = require('redis');
const bluebird = require('bluebird');


bluebird.promisifyAll(redis.Multi.prototype);
bluebird.promisifyAll(redis.RedisClient.prototype);
// init redis client to use later
const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_URL);
redisClient.flushdb((err) => {
  // eslint-disable-next-line no-console
  if (err) console.error('Redis is NOT flushed');
  // eslint-disable-next-line no-console
  else console.log('Redis is flushed');
});


module.exports = {
  redisClient,
};
