const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
require('dotenv').config();

// Database calling
let idLoggedIn = 18;
let db = null;
let usersCollection = null;
let url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}${process.env.DB_END}`;

mongo.MongoClient.connect(url, {
  useUnifiedTopology: true
}, function (
  err,
  client
) {
  if (err) {
    throw err;
  } else if (client) {
    console.log('Connected to database');
  }
  db = client.db(process.env.DB_NAME);
  usersCollection = db.collection('users');
});

// Routing
router.get('/', signIn); // Rowan, eerste pagina (index)
router.get('/registration', registration); // Rowan klaar
router.post('/registration', createAccount); // Rowan klaar
router.post('/home', logIn); // Rowan
router.get('/profile', profileOfMe); // Rowan
router.post('/profile', postProfile); // Rowan
router.get('/home', home); // Jordy & Veerle
router.get('/currentUser', showUser); // Jordy
router.post('/match', match); // Jordy
router.get('/matchlist', matchList); // Jordy
router.get('/filter', filter); // Veerle - KLAAR
router.post('/home', postFilter); // Veerle - BIJNA KLAAR
router.get('/*', error); // Veerle - KLAAR

// Routing functions
async function signIn(req, res, next) {
  // Rowan
  try {
    res.render('index.ejs');
  } catch (err) {
    next(err);
  }
}

async function registration(req, res, next) {
  // Rowan
  try {
    res.render('registration');
  } catch (err) {
    next(err);
  }
}

async function createAccount(req, res, next) {
  // Rowan
  try {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let password = req.body.password;
    let gender = req.body.gender;
    let age = req.body.age;


    let data = {
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'password': password,
      'gender': gender,
      'age': age,
    };
    // Pusht de data + input naar database
    await db.collection('users').insertOne(data);
    console.log('Created new user');
    res.render('succes');
  } catch {
    next(err);
  }
}

async function logIn(req, res, next) {
  // Rowan
  try {
    //Veerle: Rowan, hierin moet een session beginnen met de 
    //globale: loggedInUser. < dit is de ingelogde gebruiker.
    //Voor nu zet ik er even static code in zodat mijn code alvast kan werken: 
    req.session.gender = 'everyone';
    req.session.movie = '';
    loggedInUser = 5;
    // code
    // post gegevens signin, res.redirect('/home')
  } catch (err) {
    next(err);
  }
}

async function profileOfMe(req, res, next) {
  // Rowan
  try {
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
    next(err);
  }
}

function showMe(user) {
  // To get myself out of array
  return user.id === idLoggedIn;
}

async function home(req, res, next) {
  // Jordy & Veerle
  // Routes function home, graps every user with 'seen: false' and shows them on page.
  try {
    let database = await usersCollection.find().toArray(); // this code can be removed at the point sessions works.
    let myself = database.filter(showMe);
    let liked = myself[0].liked;
    let disliked = myself[0].disliked;
    let allUsers = await usersCollection.find({
      $and: [{
        id: {
          $ne: idLoggedIn
        }
      }, {
        id: {
          $nin: liked
        }
      }, {
        id: {
          $nin: disliked
        }
      }, ],
    }).toArray();
    // let filtered = await checkGenderPref(hierin moet een array komen van gebruikers VOOR filteren, thisUser);
    res.render('home.ejs', {
      users: allUsers
    });
  } catch (err) {
    next(err);
  }
}

async function showUser(req, res, next) {
  try {
    res.render('currentUser.ejs');
  } catch (err) {
    next(err);
  }
}

async function match(req, res, next) {
  // res.render('match.ejs');
  try {
    let users = await usersCollection.find({
      seen: false
    }).toArray();
    let matchedUser = deleteYourself(users);
    let x = completeCollection.length - 1;

    if (req.body.like) {
      usersCollection.updateOne({
        _id: completeCollection[x]._id
      }, {
        $set: {
          match: true,
          seen: true
        }
      });
      console.log(
        `you have a like with ${completeCollection[x].firstName}, and the ID is ${completeCollection[x]._id}`
      );
      res.render('match.ejs', {
        users: matchedUser
      }); // data uit database halen en printen onder noemer 'users' in EJS templates
    } else if (req.body.dislike) {
      usersCollection.updateOne({
        _id: completeCollection[x]._id
      }, {
        $set: {
          match: false,
          seen: true
        }
      });
      res.redirect('/');
    }
  } catch (err) {
    next(err);
  }
}

async function matchList(req, res, next) {
  // Route match overview, graps every user with 'match: true' and will be displayed on overview page.
  try {
    let matches = await usersCollection.find({
      match: true
    }).toArray();
    res.render('matchlist.ejs', {
      users: matches
    });
  } catch (err) {
    next(err);
  }
}

function checkGenderPref(users, loggedIn) {
  //Filters the users by gender and movie preferences and returns
  //a boolean if the conditions are correct for both sides:
  return users.filter(function (user) {
    if (loggedIn[0].prefGender === user.gender && loggedIn[0].gender === user.prefGender) {
      return checkMoviePref(user, loggedIn);
    } else if (user.prefGender === "everyone" && loggedIn[0].prefGender === "everyone") {
      return checkMoviePref(user, loggedIn);
    } else if (user.prefGender === "everyone" && user.gender === loggedIn[0].prefGender) {
      return checkMoviePref(user, loggedIn);
    } else if (loggedIn[0].prefGender === "everyone" && user.prefGender === loggedIn[0].gender) {
      return checkMoviePref(user, loggedIn);
    }
  })
}

function checkMoviePref(user, loggedIn) {
  //Filters the users by gender and movie preferences and returns
  //a boolean if the conditions are correct for both sides:
  if (loggedIn[0].prefMovies === "") {
    return true;
  } else if (loggedIn[0].prefMovies !== "") {
    return user.movies.find(function (movie) {
      return movie === loggedIn[0].prefMovies;
    });
  }
}

async function filter(req, res, next) {
  // Veerle
  //Displays the filter page with the sessions:
  try {
    res.render('filter.ejs', {
      gender: req.session.gender,
      movie: req.session.movie
    });
  } catch (err) {
    next(err);
  }
}

async function postFilter(req, res, next) {
  // Veerle
  //Retrieves the entered preferences and sends them to the 
  //updatePreferences function. After this the index page is 
  //redirected again:
  try {
    if (req.body.remove) {
      await updatePreferences('everyone', '');
      req.session.gender = 'everyone';
      req.session.movie = '';
    } else {
      await updatePreferences(req.body.gender, req.body.movies);
    }
  } catch (err) {
    next(err);
  }
}

async function updatePreferences(genderPreference, moviePreference) {
  // Veerle
  // Updates the database with the new preferences from the form:
  try {
    await usersCollection.updateOne({
      id: loggedInUser
    }, {
      $set: {
        prefGender: genderPreference,
        prefMovies: moviePreference
      }
    });
  } catch {
    next(err);
  }
}

async function error(req, res, next) {
  // Veerle
  // Displays the error page:
  try {
    res.render('404.ejs');
  } catch (err) {
    next(err);
  }
}

module.exports = router;