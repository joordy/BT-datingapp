const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Database calling
let idLoggedIn = 14;
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

router.get('/profile', profileOfMe); // Rowan
router.post('/profile', postProfile); // Rowan
router.post('/updateProfile', updateProfile);
router.post('/forgotPassword', forgotPassword);

function showMe(user) {
  // To get static user out of array with people
  return user.id === idLoggedIn;
}

async function profileOfMe(req, res, next) {
  // Rowan
  try {
    let database = await usersCollection.find().toArray(); // this code can be removed at the point sessions works.
    let myself = database.filter(showMe);
    res.render('profile.ejs', { user: myself });
    //Veerle: Rowan, hierin moet een session beginnen met de
    //globale: idLoggedIn. < dit is de ingelogde gebruiker.
    //Voor nu zet ik er even static code in zodat mijn code alvast kan werken:
    // req.session.gender = 'everyone';
    // req.session.movie = '';
    // code
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

module.exports = router;
