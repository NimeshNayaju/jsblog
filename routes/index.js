const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');
const Blog = require('../models/blog');

router.get('/', (req, res) => {
  res.redirect('/blogs');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Blog.find({user: req.user.id})
    .then((blogs) => {
      res.render('index/dashboard', {blogs: blogs});
    });
});

router.get('/about', (req, res) => {
  res.render('index/about');
});

module.exports = router;