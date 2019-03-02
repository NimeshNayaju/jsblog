const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');
const Blog = require('../models/blog');
const User = require('../models/user');

// Blog index
router.get('/', (req, res) => {
  Blog.find({status: 'public'})
    .populate('user')
    .then((blogs) => {
      res.render('blogs/index', {blogs: blogs});
    });
});

// Create Blog GET
router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('blogs/create');
});

// Create Blog POST
router.post('/', (req, res) => {
  let allowComments;
  
  if(req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newBlog = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  }

  new Blog(newBlog)
    .save()
    .then((blog) => {
      res.redirect(`/blogs/${blog.id}`);
    });
});

// Show blog
router.get('/:id', (req, res) => {
  Blog.findOne({
    _id: req.params.id
  })
  .populate('user')
  .then((blog) => {
    res.render('blogs/show', {blog: blog});
  })
});

module.exports = router;