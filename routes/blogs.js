const express = require('express');
const router = express.Router();

// Blog index
router.get('/', (req, res) => {
  res.render('blogs/index');
});

// Create Blog form
router.get('/create', (req, res) => {
  res.render('blogs/create');
});

module.exports = router;