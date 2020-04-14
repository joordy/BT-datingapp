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
    }
    db = client.db(process.env.DB_NAME);
    usersCollection = db.collection('users');
  }
);

router.get('/registration', registration); 
router.post('/registration', createAccount); 

async function registration(req, res, next) {
  // Loads the registration page
  try {
    res.render('registration.ejs');
  } catch (err) {
    next(err);
  }
}

async function createAccount(req, res, next) {
  // Page to fill in all user information to register
  try {
    const allUsers = await usersCollection.find().toArray();
    let totalCount = allUsers.length + 1;
    const password = req.body.password;
    // hashes the password with salt
    let hashPassword = bcrypt.hashSync(password, 10);
      // body pulled from forms
      let firstName = req.body.firstName;
      let lastName = req.body.lastName;
      let email = req.body.email;
      let gender = req.body.gender;
      let age = req.body.age;
      let work = req.body.work;
      let movie1 = req.body.movie1;
      let movie2 = req.body.movie2;

    // makes age integer
    let photo;
    age = parseInt(age);
    if (gender === 'man') {
      photo = 'man.png';
    } else {
      photo = 'woman.png'
    }
      // data send to the DB
      let data = {
        'id': totalCount,
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'password': hashPassword,
        'gender': gender,
        'age': age,
        'photo': photo,
        'work': work,
        'movies': [movie1, movie2],
        'prefGender': 'everyone',
        'prefMovie': '',
        'liked': [],
        'disliked': [],
      };
      usersCollection.insertOne(data);
      console.log('Created new user');
      res.render('signIn.ejs', {text: "Created the account!"});
  } catch (err) {
    next(err);
  }
}

module.exports = router;
