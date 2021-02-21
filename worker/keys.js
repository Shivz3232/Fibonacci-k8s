/*
 *  Primary file to serve the keys
 *
 */

// Container for keys
const keys = {
    "redisHost": process.env.REDIS_HOST,
    "redisPort": process.env.REDIS_PORT
};

// Export the module
module.exports = keys;