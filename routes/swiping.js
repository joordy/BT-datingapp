const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
// const bcrypt = require('bcrypt');
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

router.get('/', home); // Jordy & Veerle
router.post('/match', match); // Jordy
router.get('/matchlist', matchList); // Jordy
router.get('/filter', filter); // Veerle - KLAAR
router.post('/', postFilter); // Veerle - BIJNA KLAAR

function showMe(user) {
  // To get static user out of array with people
  return user.id === idLoggedIn;
}

async function home(req, res, next) {
  // Jordy & Veerle
  // Routes function home, graps every user not in 'liked' or 'disliked', meets the filters, and shows them on page.
  try {
    let database = await usersCollection.find().toArray(); // this code can be removed at the point sessions works.
    let myself = database.filter(showMe);
    let liked = myself[0].liked;
    let disliked = myself[0].disliked;
    let allUsers = await usersCollection
      .find({
        $and: [
          { id: { $ne: idLoggedIn } },
          { id: { $nin: liked } },
          { id: { $nin: disliked } },
        ],
      })
      .toArray();
    req.session.gender = myself[0].prefGender;
    req.session.movie = myself[0].prefMovie;
    let filtered = await checkGenderPref(allUsers, myself);
    res.render('index.ejs', {
      users: filtered,
    });
  } catch (err) {
    next(err);
  }
}

function updateDatabase(input, user) {
  // function to use the like and dislike button on /home
  if (input.like) {
    usersCollection.updateOne(
      { id: idLoggedIn },
      { $push: { liked: user.id } }
    );
    return true;
  } else if (input.dislike) {
    usersCollection.updateOne(
      { id: idLoggedIn },
      { $push: { disliked: user.id } }
    );
    return false;
  }
}

async function match(req, res, next) {
  // Route match page, when pressing like, database will be updated with 'seen: true' & 'match: true'. Users gets match page.
  // When pressing dislike, database will be updated with 'seen: true' & match stays false. Index page will be rerendered.
  try {
    let database = await usersCollection.find().toArray(); // this code can be removed at the point sessions works.
    let myself = database.filter(showMe);
    let liked = myself[0].liked;
    let disliked = myself[0].disliked;
    let allUsers = await usersCollection
      .find({
        $and: [
          { id: { $ne: idLoggedIn } },
          { id: { $nin: liked } },
          { id: { $nin: disliked } },
        ],
      })
      .toArray();
    req.session.gender = myself[0].prefGender;
    req.session.movie = myself[0].prefMovie;
    let filtered = await checkGenderPref(allUsers, myself);
    let indexUser = filtered.length - 1;
    let user = filtered[indexUser];

    let value = updateDatabase(req.body, user);

    if (value === true && user.liked.includes(idLoggedIn)) {
      console.log(
        `you have a like with ${user.firstName}, and the ID is ${user._id}, ${user.liked}`
      );
      res.render('match.ejs', {
        users: user,
        userLoggedIn: myself,
      });
    } else if (value === true) {
      console.log(
        `You like ${user.firstName}, but he/she hasn't liked you yet.`
      );
      res.redirect('/');
    } else if (value === false) {
      res.redirect('/');
    }
  } catch (err) {
    next(err);
  }
}

async function matchList(req, res, next) {
  // Route match overview, graps every user with 'match: true' and will be displayed on overview page.
  try {
    let database = await usersCollection.find().toArray();
    let myself = database.filter(showMe);
    let liked = myself[0].liked;
    let matches = await usersCollection.find({ id: { $in: liked } }).toArray();
    let lijstje = [];

    await matches.forEach(function (user) {
      user.liked.forEach(function (id) {
        if (id === myself[0].id) {
          lijstje.push(user);
        }
      });
    });

    res.render('matchlist.ejs', {
      users: lijstje,
    });
  } catch (err) {
    next(err);
  }
}

function checkGenderPref(users, loggedIn) {
  //Veerle
  //Filters the users by gender and sends to checkMoviePref and returns
  //a boolean if the conditions are correct for both sides:
  return users.filter(function (user) {
    if (
      loggedIn[0].prefGender === user.gender &&
      loggedIn[0].gender === user.prefGender
    ) {
      return checkMoviePref(user, loggedIn);
    } else if (
      user.prefGender === 'everyone' &&
      loggedIn[0].prefGender === 'everyone'
    ) {
      return checkMoviePref(user, loggedIn);
    } else if (
      user.prefGender === 'everyone' &&
      user.gender === loggedIn[0].prefGender
    ) {
      return checkMoviePref(user, loggedIn);
    } else if (
      loggedIn[0].prefGender === 'everyone' &&
      user.prefGender === loggedIn[0].gender
    ) {
      return checkMoviePref(user, loggedIn);
    }
  });
}

function checkMoviePref(user, loggedIn) {
  //Veerle
  //Filters the users by movie preferences and returns
  //a boolean if the conditions are correct:
  if (loggedIn[0].prefMovie === '') {
    return true;
  } else if (loggedIn[0].prefMovie !== '') {
    return user.movies.find(function (movie) {
      return movie === loggedIn[0].prefMovie;
    });
  }
}

async function filter(req, res, next) {
  // Veerle
  //Displays the filter page with the sessions for the
  //filter preferences:
  try {
    res.render('filter.ejs', {
      gender: req.session.gender,
      movie: req.session.movie,
    });
  } catch (err) {
    next(err);
  }
}

async function postFilter(req, res, next) {
  // Veerle
  //Retrieves the entered preferences and sends them to the
  //updatePreferences function. After this the /home page is
  //redirected again:
  try {
    if (req.body.remove) {
      await updatePreferences('everyone', '');
      req.session.gender = 'everyone';
      req.session.movie = '';
    } else {
      await updatePreferences(req.body.gender, req.body.movies);
    }
    res.redirect('/');
  } catch (err) {
    next(err);
  }
}

async function updatePreferences(genderPreference, moviePreference) {
  // Veerle
  // Updates the database with the new preferences from the filter
  // preferences form:
  try {
    await usersCollection.updateOne(
      { id: idLoggedIn },
      { $set: { prefGender: genderPreference, prefMovie: moviePreference } }
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = router;
