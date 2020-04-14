const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const bcrypt = require('bcrypt');
const multer = require('multer');

// SET STORAGE
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/static/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})
let upload = multer({ storage: storage })




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

router.get('/profile', userUndefined, profileOfMe); // Rowan
// router.post('/profile', profileOfMe);
router.get('/updateProfile', editPage);
router.post('/profile', postProfile); //upload.single('myImage'),
router.post('/signOut', signOut);
router.get('/passwordform', passwordForm);


function userUndefined (req, res, next) {
  if (req.session.idLoggedIn === undefined ) {
    res.redirect('/signin')
  } else {
    next();
  }
}

async function profileOfMe(req, res, next) {
  // Rowan
  try {
    let myself = await usersCollection.find({id : req.session.idLoggedIn}).toArray();
    // console.log(req.session.idLoggedIn);
    res.render('profile.ejs', { user: myself[0]});
  } catch (err) {
    next(err);
  }
}

async function editPage(req, res, next) {
  // Rowan
  try {
    let myself = await usersCollection.find({id : req.session.idLoggedIn}).toArray();
    console.log(req.session.idLoggedIn);
    res.render('updateProfile.ejs', { user: myself[0] });
  } catch (err) {
    next(err);
  }
}

async function postProfile(req, res, next) {
  // Rowan & Veerle
  try {
    let myself = await usersCollection.find({id : req.session.idLoggedIn}).toArray();
    let name = req.body.firstName;
    let email = req.body.email;
    let age = req.body.age;

    await usersCollection.updateOne(
      { id: myself[0].id },
      { $set: { firstName: name, email: email, age: age }
      }
    );
    res.redirect('/profile');
  //   console.log(req.file);
  //       upload.single('myImage'), (req, res) => {
  //     let img = fs.readFileSync(req.file.path);
  //     let encode_image = img.toString('base64');
  //  // Define a JSONobject for the image attributes for saving to database
    
  //  let finalImg = {
  //       contentType: req.file.mimetype,
  //       image:  new Buffer(encode_image, 'base64')
  //    };
     
  // usersCollection.insertOne(finalImg, (err, result) => {
  //     console.log(result)
   
  //     if (err) return console.log(err)
   
  //     console.log('saved to database')
  //     res.redirect('/') 
  //   })
  // }
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
  try{
    res.render('changePassword');

}   catch (err) {
    next(err);
  }
}

async function changePassword(req, res) {
  try{ 
    if (req.session.loggedIN === true) {
      usersCollection.findOne({ email: req.session.user.email })
        if (data) {
          const query = { email: data.email };
          const update = { '$set': { 'password': req.body.newPassword } };
          const options = { returnNewDocument: true };
          usersCollection.findOneAndUpdate(query, update, options );
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
