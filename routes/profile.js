const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const bcrypt = require('bcrypt');
const multer = require('multer');

// SET STORAGE
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/static/images/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
let upload = multer({ storage: storage });

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
router.post('/profile', profileOfMe);
router.get('/updateProfile', editPage);
router.post('/updateProfile', upload.single('myImage'), updateProfile);
router.post('/signOut', signOut);
router.get('/passwordform', passwordForm);

function userUndefined(req, res, next) {
  // Redirect user to Sign in if not logged in. You must have an account for the application.
  if (req.session.idLoggedIn === undefined) {
    res.redirect('/signin');
  } else {
    next();
  }
}

async function profileOfMe(req, res, next) {
  // Rowan
  try {
    console.log(req.session.idLoggedIn);
    res.render('profile.ejs', { user: req.session.idLoggedIn });
  } catch (err) {
    next(err);
  }
}

async function editPage(req, res, next) {
  // Rowan
  try {
    console.log(req.session.idLoggedIn);
    res.render('updateProfile.ejs', { user: req.session.idLoggedIn });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  // Rowan
  try {
    console.log(req.file);
    upload.single('myImage'),
      (req, res) => {
        let img = fs.readFileSync(req.file.path);
        let encode_image = img.toString('base64');
        // Define a JSONobject for the image attributes for saving to database
        let finalImg = {
          contentType: req.file.mimetype,
          image: new Buffer(encode_image, 'base64'),
        };

        usersCollection.insertOne(finalImg, (err, result) => {
          console.log(result);

          if (err) return console.log(err);

          console.log('saved to database');
          res.redirect('/');
        });
      };
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

async function passwordForm(req, res, next) {
  try {
    res.render('changePassword');
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res) {
  try {
    if (req.session.loggedIN === true) {
      usersCollection.findOne({ email: req.session.user.email });
      if (data) {
        const query = { email: data.email };
        const update = { $set: { password: req.body.newPassword } };
        const options = { returnNewDocument: true };
        console.log();
        usersCollection.findOneAndUpdate(query, update, options);
        if (updatedDocument) {
          req.session.loggedIN = false;
          res.render('/profile');
        }
        return updatedDocument;
      }
    }
  } catch (err) {
    next(err);
  }
}

module.exports = router;
