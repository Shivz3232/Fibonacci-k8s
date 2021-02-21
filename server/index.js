/*
 *  Primary file for our server 
 *
 */

//  Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');
const { Pool } = require('pg');
const keys = require('./keys');

// Express app setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client setup
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

// Create a table if not exists
pgClient.on('connect', () => {
    pgClient
        .query('CREATE TABLE IF NOT EXISTS values (number INT)')
        .catch((err) => {
            if (!err) {
                console.log("The query was successful!");
            } else {
                console.log(err);
            }
        });
});


//  Redis client setup
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

// Initiate the publiser with redis
const redisPublisher = redisClient.duplicate();

/* 
 *  Express route handlers
 *
 */

//  Sanitary check
app.get('/ping', (req, res) => {
    res.writeHead(200);
    res.end();
});

// Retrieve all the idex ever queried
app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows);
});

// Retrieve all index value pairs from redis
app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

// POST handler from client
// Required params: index
// Optional params: None
app.post('/values', async (req, res) => {
    // Sanitize the index
    const index = typeof (req.body.index) == 'number' && req.body.index > 0 && req.body.index < 41 ? req.body.index : false;
    if (index) {
        // Add the index to key value store with arbitrary value
        redisClient.hset('values', index, 'Nothing yet!');

        // Publish the index to the insert channel of redis for value calculation
        redisPublisher.publish('insert', index);
        
        // Write the index to Postgres
        pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

        // Return the response
        res.writeHead(200);
        res.end();
    } else {
        res.status(422).send('Please make sure the index is between [0,40] and an integer');
    }
});

// Start the express app
app.listen(keys.expressPort, err => {
    if (!err) {
        console.log("Express app listening on port: ", keys.expressPort);
    }
});