// require packages
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const slug = require('slug');
const session = require('express-session');
const mongo = require('mongodb');
const assert = require('assert');
// const routing = require('./routes/route.js');
const signinRouter = require('./routes/signin');
const registerRouter = require('./routes/register');
const swipingRouter = require('./routes/swiping');
const profileRouter = require('./routes/profile');
const errorRouter = require('./routes/error');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || process.env.DB_PORT;

// Middleware set-up
app.set('view engine', 'ejs');
app.set('views', 'view');
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.ieNoOpen());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
app.use(helmet.xssFilter({ setOnOldIE: true }));

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 600000 },
    resave: true,
    saveUninitialized: true,
    secure: true,
  })
);
app.use('/', signinRouter); // Signin routes
app.use('/', registerRouter); // Register routes
app.use('/', swipingRouter); // Liking and filtering routes
app.use('/', profileRouter); // Profile routes
app.use('/', errorRouter); // Error 404 routes

// Server deploying on https://localhost:
app.listen(PORT, function () {
  console.log(`App is listening on ${PORT}!`);
});
