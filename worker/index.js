/*
 *  Primary file to access Redis
 *
 */

//  Dependencies
const keys = require('./keys');
const redis = require("redis");

// Initiate the redis client
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

// Subscribe to the redis client
const sub = redisClient.duplicate();

// Method to find the Fibbonaci number at the given index
function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}

// Subscribe to the message channel
sub.subscribe('insert');

// Listen for publications with topic message for the input on the redis client channel
sub.on('message', (channel, message) => {
    // Calculate the fib value of the message sent and store it as key value pair in redis hash set
    console.log(message);
    redisClient.hset('values', message, fib(parseInt(message)));
});