// require packages
const express = require('express');
const bodyParser = require('body-parser');
const slug = require('slug');
const session = require('express-session');
const mongo = require('mongodb');
const assert = require('assert');
const routing = require('./routes/route.js');
require('dotenv').config();

// Variables
const app = express();
const PORT = process.env.DB_PORT || process.env.PORT;

// Middleware set-up
app.set('view engine', 'ejs');
app.set('views', 'view');
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    // cookie: { secure: true }
  })
);
app.use('/', routing); // using routing module

// Server deploying on https://localhost:
app.listen(PORT, () => console.log(`App is listening on ${PORT}!`));
