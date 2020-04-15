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

router.get('/signIn', signIn); 
router.post('/signIn', logIn); 

async function signIn(req, res, next) {
  // Loads log in screen:
  try {
    let message = '';
    res.render('signIn.ejs', { text: message });
  } catch (err) {
    next(err);
  }
}

async function logIn(req, res) {
  // Checks if user has right email and password:
  try {
    let person = await usersCollection.findOne({ email: req.body.email });
    if (person) {
      if (bcrypt.compareSync(req.body.password, person.password)) {
        req.session.idLoggedIn = person.id;
        res.render('profile.ejs', { user: person });
        console.log('Logged in as ' + person.firstName);
      } else {
        res.render('signin.ejs', {
          text: 'Sorry: this password is incorrect.',
        });
      }
    } else {
      res.render('signin.ejs', { text: 'Sorry: this email does not exists.' });
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = router;
