const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
// const bcrypt = require('bcrypt');
require('dotenv').config();

// Database calling
// let idLoggedIn = req.session.idLoggedIn;
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

router.get('/', userUndefined, home); // Jordy & Veerle
router.get('/currentUser', userUndefined, currentUsers); // Jordy &
router.post('/match', match); // Jordy
router.get('/matchlist', userUndefined, matchList); // Jordy
router.get('/filter', userUndefined, filter); // Veerle - KLAAR
router.post('/', postFilter); // Veerle - BIJNA KLAAR

function userUndefined(req, res, next) {
  if (req.session.idLoggedIn === undefined) {
    res.redirect('/signin');
  } else {
    next();
  }
}

async function home(req, res, next) {
  // Jordy & Veerle
  // Routes function home, graps every user not in 'liked' or 'disliked', meets the filters, and shows them on page.
  try {
    // let idLoggedIn = req.session.idLoggedIn;
    console.log(req.session.idLoggedIn);
    let myself = await usersCollection
      .find({ id: req.session.idLoggedIn })
      .toArray(); // this code can be removed at the point sessions works.
    let liked = myself[0].liked;
    let disliked = myself[0].disliked;
    let allUsers = await usersCollection
      .find({
        $and: [
          { id: { $ne: req.session.idLoggedIn } },
          { id: { $nin: liked } },
          { id: { $nin: disliked } },
        ],
      })
      .toArray();
    let filtered = await checkGenderPref(allUsers, myself[0]);
    res.render('index.ejs', {
      users: filtered,
    });
  } catch (err) {
    next(err);
  }
}
async function currentUsers(req, res, next) {
  try {
    res.render('currentUser.ejs', { user: lastOne });
  } catch (err) {
    next(err);
  }
}

function updateDatabase(input, user, loggedIn) {
  // function to use the like and dislike button on /home
  if (input.like) {
    usersCollection.updateOne(
      { id: loggedIn.id },
      { $push: { liked: user.id } }
    );
    return true;
  } else if (input.dislike) {
    usersCollection.updateOne(
      { id: loggedIn.id },
      { $push: { disliked: user.id } }
    );
    return false;
  }
}

async function match(req, res, next) {
  // Route match page, when pressing like, database will be updated with 'seen: true' & 'match: true'. Users gets match page.
  // When pressing dislike, database will be updated with 'seen: true' & match stays false. Index page will be rerendered.
  try {
    let myself = await usersCollection
      .find({ id: req.session.idLoggedIn })
      .toArray(); // this code can be removed at the point sessions works.
    let liked = myself[0].liked;
    let disliked = myself[0].disliked;
    let allUsers = await usersCollection
      .find({
        $and: [
          { id: { $ne: req.session.idLoggedIn } },
          { id: { $nin: liked } },
          { id: { $nin: disliked } },
        ],
      })
      .toArray();
    let filtered = await checkGenderPref(allUsers, myself[0]);
    let indexUser = filtered.length - 1;
    let user = filtered[indexUser];
    let value = updateDatabase(req.body, user, myself[0]);

    if (value === true && user.liked.includes(req.session.idLoggedIn)) {
      console.log(
        `you have a like with ${user.firstName}, and the ID is ${user._id}, ${user.liked}`
      );
      res.render('match.ejs', {
        users: user,
        userLoggedIn: myself[0],
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
    let myself = await usersCollection
      .find({ id: req.session.idLoggedIn })
      .toArray(); // this code can be removed at the point sessions works.
    let liked = myself[0].liked;
    let matches = await usersCollection.find({ id: { $in: liked } }).toArray();
    let lijstje = [];

    await matches.forEach(function (user) {
      user.liked.forEach(function (id) {
        if (id === req.session.idLoggedIn) {
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
      loggedIn.prefGender === user.gender &&
      loggedIn.gender === user.prefGender
    ) {
      return checkMoviePref(user, loggedIn);
    } else if (
      user.prefGender === 'everyone' &&
      loggedIn.prefGender === 'everyone'
    ) {
      return checkMoviePref(user, loggedIn);
    } else if (
      user.prefGender === 'everyone' &&
      user.gender === loggedIn.prefGender
    ) {
      return checkMoviePref(user, loggedIn);
    } else if (
      loggedIn.prefGender === 'everyone' &&
      user.prefGender === loggedIn.gender
    ) {
      return checkMoviePref(user, loggedIn);
    }
  });
}

function checkMoviePref(user, loggedIn) {
  //Veerle
  //Filters the users by movie preferences and returns
  //a boolean if the conditions are correct:
  if (loggedIn.prefMovie === '') {
    return true;
  } else if (loggedIn.prefMovie !== '') {
    return user.movies.find(function (movie) {
      return movie === loggedIn.prefMovie;
    });
  }
}

async function filter(req, res, next) {
  // Veerle
  //Displays the filter page with the sessions for the
  //filter preferences:
  let myself = await usersCollection
    .find({ id: req.session.idLoggedIn })
    .toArray(); // this code can be removed at the point sessions works.
  try {
    res.render('filter.ejs', {
      gender: myself[0].prefGender,
      movie: myself[0].prefMovie,
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
    let myself = await usersCollection
      .find({ id: req.session.idLoggedIn })
      .toArray(); // this code can be removed at the point sessions works.
    if (req.body.remove) {
      await updatePreferences(req.session.idLoggedIn, 'everyone', '');
    } else {
      await updatePreferences(myself[0].id, req.body.gender, req.body.movies);
    }
    res.redirect('/');
  } catch (err) {
    next(err);
  }
}

async function updatePreferences(loggedIn, genderPreference, moviePreference) {
  // Veerle
  // Updates the database with the new preferences from the filter
  // preferences form:
  try {
    await usersCollection.updateOne(
      { id: loggedIn },
      { $set: { prefGender: genderPreference, prefMovie: moviePreference } }
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = router;
