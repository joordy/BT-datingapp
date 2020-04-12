const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const bcrypt = require('bcrypt');
require('dotenv').config();
 
// Database calling
let idLoggedIn = 18;
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
 
// Routing
router.get('/signIn', signIn); // Rowan, eerste pagina (index)
router.get('/registration', registration); // Rowan klaar
router.post('/registration', createAccount); // Rowan klaar
router.post('/signIn', logIn); // Rowan
router.get('/profile', profileOfMe); // Rowan
router.post('/profile', postProfile); // Rowan
router.post('/updateProfile', updateProfile);
router.post('/forgotPassword', forgotPassword);
router.get('/', home); // Jordy & Veerle
router.get('/currentUser', showUser); // Jordy
router.post('/match', match); // Jordy
router.get('/matchlist', matchList); // Jordy
router.get('/filter', filter); // Veerle - KLAAR
router.post('/', postFilter); // Veerle - BIJNA KLAAR
router.get('/*', error); // Veerle - KLAAR
 
// Routing functions
async function signIn(req, res, next) {
  // Rowan
  try {
    res.render('signIn.ejs');
  } catch (err) {
    next(err);
  }
}
 
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
    let totalCount = allUsers.length +1;
    // rounds(of salt) is the number of times in which the password is generated
    const rounds = 10;
    const password = req.body.password;
    // hashes the password with salt
    bcrypt.hash(password, rounds, (err, hash) => {
      if (err) {
        console.error(err);
        return;
      }
      //logs the hash code
      console.log(hash);
    
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
      'id': totalCount,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'password': hash,
      'gender': gender,
      'age': age,
      'photo': photo,
      'work': work,
      'movies': [],
      'prefGender': 'everyone',
      'prefMovie': '',
      'liked': [],
      'disliked': [],
    };
    const hashPassword = async () => {
      const hash = await bcrypt.hash(password, rounds);
      console.log(hash);
    };
    hashPassword();

    usersCollection.insertOne(data);
    console.log('Created new user');
    res.render('profile.ejs');
    })
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
        if (req.session.regenerate(function(err) {
          // will have a new session here
        }) ){
          req.session.user = data;
          console.log(req.session.user);
          res.render('profile.ejs', { user: data });
          console.log(`Logged in as ` + req.session.user.firstName);
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
  }) 
 } catch (err) {
    console.log(err);
  }
}
 
async function profileOfMe(req, res, next) {
  // Rowan
  try {
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
 
async function showUser(req, res, next) {
  try {
    res.render('currentUser.ejs');
  } catch (err) {
    next(err);
  }
}
 
function updateDatabase(input, user) {
  // function to use the like and dislike button on /home
  if (input.like) {
    usersCollection.updateOne(
      {
        id: idLoggedIn,
      },
      {
        $push: {
          liked: user.id,
        },
      }
    );
    return true;
  } else if (input.dislike) {
    usersCollection.updateOne(
      {
        id: idLoggedIn,
      },
      {
        $push: {
          disliked: user.id,
        },
      }
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
        users: user, userLoggedIn: myself});
    } else if (value === true) {
      console.log(
        `You like ${user.firstName}, but he/she hasn't liked you yet.`
<<<<<<< HEAD
     );
     res.redirect('/home');
   } else if (value === false) {
     res.redirect('/home');
   }
 } catch (err) {
   next(err);
 }
=======
      );
      res.redirect('/');
    } else if (value === false) {
      res.redirect('/');
    }
  } catch (err) {
    next(err);
  }
>>>>>>> develop
}
 
async function matchList(req, res, next) {
 // Route match overview, graps every user with 'match: true' and will be displayed on overview page.
 try {
   let database = await usersCollection.find().toArray();
   let myself = database.filter(showMe);
   let liked = myself[0].liked;
   let matches = await usersCollection
     .find({
       id: {
         $in: liked,
       },
     })
     .toArray();
 
   res.render('matchlist.ejs', {
     users: matches,
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
<<<<<<< HEAD
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
   res.redirect('/home');
 } catch (err) {
   next(err);
 }
=======
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
>>>>>>> develop
}
 
async function updatePreferences(genderPreference, moviePreference) {
 // Veerle
 // Updates the database with the new preferences from the filter
 // preferences form:
 try {
   await usersCollection.updateOne(
     {
       id: idLoggedIn,
     },
     {
       $set: {
         prefGender: genderPreference,
         prefMovie: moviePreference,
       },
     }
   );
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