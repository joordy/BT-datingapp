const express = require('express');
const router = express.Router();
require('dotenv').config();

router.get('/*', error);

async function error(req, res, next) {
  // Error when on a route, that doesn't exists.
  try {
    res.render('404.ejs');
  } catch (err) {
    next(err);
  }
}

module.exports = router;
