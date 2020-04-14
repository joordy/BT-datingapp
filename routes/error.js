const express = require('express');
const router = express.Router();
require('dotenv').config();

router.get('/*', error); // Veerle - KLAAR

async function error(req, res, next) {
  // Veerle
  try {
    res.render('404.ejs');
  } catch (err) {
    next(err);
  }
}

module.exports = router;
