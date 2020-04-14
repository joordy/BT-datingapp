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
    }
    db = client.db(process.env.DB_NAME);
    usersCollection = db.collection('users');
  }
);

router.get('/registration', registration); // Rowan klaar
router.post('/registration', createAccount); // Rowan klaar

async function registration(req, res, next) {
  // Rowan
  try {
    res.render('registration.ejs');
  } catch (err) {
    next(err);
  }
}

async function createAccount(req, res, next) {
  // Rowan
  try {
    const allUsers = await usersCollection.find().toArray();
    let totalCount = allUsers.length + 1;
    // rounds(of salt) is the number of times in which the password is generated
    // const rounds = 10;
    const password = req.body.password;
    // hashes the password with salt
    console.log(password);
    let hashPassword = bcrypt.hashSync(password, 10);
    console.log(hashPassword);
    // bcrypt.hash(password, rounds, (err, hash) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }

    //   //logs the hash code
    //   console.log(hash);

    // body pulled from forms
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let gender = req.body.gender;
    let age = req.body.age;
    let photo = req.body.photo;
    let work = req.body.work;

    // makes age integer
    age = parseInt(age);

    // daata send to the DB
    let data = {
      id: totalCount,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
      gender: gender,
      age: age,
      photo: photo,
      work: work,
      movies: [],
      prefGender: 'everyone',
      prefMovie: '',
      liked: [],
      disliked: [],
    };
    // const hashPassword = async () => {
    //   const hash = await bcrypt.hash(password, rounds);
    //   console.log(hash);
    // };
    // hashPassword();

    usersCollection.insertOne(data);
    console.log('Created new user');
    res.render('signIn.ejs');
    // });
  } catch (err) {
    next(err);
  }
}

module.exports = router;
