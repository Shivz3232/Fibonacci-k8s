/*
 *  Primary file to serve the required keys
 *
 */

//  Container for the keys
const keys = {
    "expressPort": process.env.EXPRESS_PORT,
    "redisHost": process.env.REDIS_HOST,
    "redisPort": process.env.REDIS_PORT,
    "pgUser": process.env.PGUSER,
    "pgHost": process.env.PGHOST,
    "pgDatabase": process.env.PGDATABASE,
    "pgPassword": process.env.PGPASSWORD,
    "pgPort": process.env.PGPORT
}

// Export the module
module.exports = keys;