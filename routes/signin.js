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

router.get('/signIn', signIn); // Rowan, eerste pagina (index)
router.post('/signIn', logIn); // Rowan

async function signIn(req, res, next) {
  // Rowan
  try {
    res.render('signIn.ejs');
  } catch (err) {
    next(err);
  }
}

async function logIn(req, res) {
  try {
    const rounds = 10;
    const password = req.body.password;
    //
    bcrypt.hash(password, rounds, (err, hash) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(hash);

      bcrypt.compare(password, hash, (err, res) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(res);
      });
      //
      const hashPassword = async () => {
        const hash = await bcrypt.hash(password, rounds);
        console.log(hash);
        console.log(await bcrypt.compare(password, hash));
      };
      hashPassword();

      // //
      usersCollection.findOne({ email: req.body.email }).then((data) => {
        if (data) {
          if (
            req.session.regenerate(function (err) {
              // will have a new session here
            })
          ) {
            req.session.user = data;
            console.log(req.session.user);
            res.render('profile.ejs', { user: data });
            console.log('Logged in as' + req.session.user.firstName);
            req.session.loggedIN = true;
          } else {
            res.render('signin.ejs');
            console.log('password incorrect');
          }
        } else {
          res.redirect('/');
          console.log('Cant find this account');
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = router;
