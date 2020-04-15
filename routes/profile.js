const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const bcrypt = require('bcrypt');
const multer = require('multer');

let storage = multer.diskStorage({
	destination: function (req, files, cb) {
		cb(null, "./static/images/users/");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});
let fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
	) {
		cb(null, true);
	} else {
		cb(new Error("File format should be PNG,JPG,JPEG"), false);
	}
};
let upload = multer({ storage: storage, fileFilter: fileFilter });

// Database variables
let db = null;
let usersCollection = null;
let url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}${process.env.DB_END}`;

mongo.MongoClient.connect(url, { useUnifiedTopology: true }, function (
  err,
  client
) {
  if (err) {
    throw err;
  } else if (client) {
  }
  db = client.db(process.env.DB_NAME);
  usersCollection = db.collection('users');
});

router.get('/profile', userUndefined, profileOfMe); 
router.get('/updateProfile',  editPage);
router.post('/profile', upload.single('myImage'), postProfile);
router.post('/signOut', signOut);

function userUndefined(req, res, next) {
  // Redirect user to Sign in if not logged in. You must have an account for the application.
  if (req.session.idLoggedIn === undefined) {
    res.redirect('/signin');
  } else {
    next();
  }
}

async function profileOfMe(req, res, next) {
  // Print the current user's profile whos logged in.
  try {
    let myself = await usersCollection.find({id : req.session.idLoggedIn}).toArray();
    res.render('profile.ejs', { user: myself[0]});
  } catch (err) {
    next(err);
  }
}

async function editPage(req, res, next) {
  // Showing the page where the user can edit his/her image, name, email and photo:
  try {
    let myself = await usersCollection.find({id : req.session.idLoggedIn}).toArray();
    console.log(req.session.idLoggedIn);

    console.log(myself[0].movies);
    res.render('updateProfile.ejs', { user: myself[0] });
  } catch (err) {
    next(err);
  }
}

async function postProfile(req, res, next) {
  // Updating the profile with new name, email, age and picture:
  try {
    let myself = await usersCollection.find({id : req.session.idLoggedIn}).toArray();
    let name = req.body.firstName;
    let email = req.body.email;
    let age = req.body.age;
    age = parseInt(age);
    let movie1 = req.body.movie1;
    let movie2 = req.body.movie2;
    let photo = req.file.originalname;
    await usersCollection.updateOne(
      { id: myself[0].id },
      { $set: { 'firstName': name, 'email': email, 'age': age, 'photo': photo}},
    );
    await usersCollection.updateOne(
      {id: myself[0].id},
      {$set: {"movies.0" : movie1}},
    );
    await usersCollection.updateOne(
      {id: myself[0].id},
      {$set: {"movies.1" : movie2}}
    );
    res.redirect('/profile');
  } catch (err) {
  next(err);
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
