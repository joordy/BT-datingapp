const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
require("dotenv").config();

// Database calling
// let yourSelf = 99999;
let db = null;
let usersCollection = null;

let url = 'mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_URL + process.env.DB_END;
mongo.MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
    if (err) {
        throw err;
    } else if (client) {
        console.log('Connected to database');
    }
    db = client.db(process.env.DB_NAME);
    usersCollection = db.collection("users");
});

// Routing
router.get('/', home)
router.get('/register', register);
router.post('/register', registerPosting)
router.post('/login', login)
router.get('/profile', profile)
router.get('/currentUser', showUser)
router.post('/match', match)
router.get('/matchlist', matchList)
router.get('/filter', filter)
router.get('/*', error) // Error route

async function home(req, res, next) {
    try {
        console.log('hello')
    } catch (err) {
        console.log(err)
    }
}

async function register(req, res, next) {
    try {

    } catch (err) {
        console.log(err)
    }
}

async function registerPosting(req, res, next) {
    try {

    } catch (err) {
        console.log(err)
    }
}

async function login(req, res, next) {
    try {

    } catch (err) {
        console.log(err)
    }
}

async function profile(req, res, next) {
    try {

    } catch (err) {
        console.log(err)
    }
}

async function showUser(req, res, next) {
    try {

    } catch (err) {
        console.log(err)
    }
}

async function match(req, res, next) {
    try {

    } catch (err) {
        console.log(err)
    }
}

async function matchList(req, res, next) {
    try {

    } catch (err) {
        console.log(err)
    }
}

async function filter(req, res, next) {
    try {

    } catch (err) {
        console.log(err)
    }
}

async function error(req, res, next) {
    try {

    } catch (err) {
        console.log(err)
    }
}

module.exports = router;