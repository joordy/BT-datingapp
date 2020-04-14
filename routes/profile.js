const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Database calling
let db = null;
let usersCollection = null;
let url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}${process.env.DB_END}`;

mongo.MongoClient.connect(
  url,
  {
    useUnifiedTopology: true,
  },
  function (err, client) {
    if (err) {
      throw err;
    } else if (client) {
      console.log('Connected to database');
    }
    db = client.db(process.env.DB_NAME);
    usersCollection = db.collection('users');
  }
);

router.get('/profile', userUndefined, profileOfMe); // Rowan
// router.post('/profile', postProfile); // Rowan
router.post('/profile', updateProfile);
//router.post('/forgotPassword', forgotPassword);
router.post('/signOut', signOut);

function userUndefined (req, res, next) {
  if (req.session.idLoggedIn === undefined ) {
    res.redirect('/signin')
  } else {
    next();
  }
}

async function profileOfMe(req, res, next) {
  // Rowan
  try {
    // console.log(req.session.idLoggedIn);
    res.render('profile.ejs', { user: req.session.idLoggedIn });
  } catch (err) {
    next(err);
  }
}

async function postProfile(req, res, next) {
  // Rowan
  try {
    // code
  } catch (err) {
    console.log(err);
  }
}

async function updateProfile(req, res, next) {
  // Rowan
  try {
    // code
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  // Rowan
  try {
    // code
  } catch (err) {
    console.log(err);
  }
}

async function signOut(req, res, next) {
  // Logout function, sends it back to login route.
  try {
    req.session.destroy();
    console.log(
      'Your session is destroyed. You can log in again to use the application.'
    );
    res.redirect('/signIn');
  } catch (err) {
    next(err);
  }
}

module.exports = router;
