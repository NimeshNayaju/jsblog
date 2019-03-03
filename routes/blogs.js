const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');
const Blog = require('../models/blog');
const User = require('../models/user');

// Blog index
router.get('/', (req, res) => {
  Blog.find({status: 'public'})
    .sort({date: 'desc'})
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

// Update blog GET
router.get('/update/:id', ensureAuthenticated, (req, res) => {
  Blog.findOne({
    _id: req.params.id
  })
  .then((blog) => {
    if(blog.user != req.user.id) {
      res.redirect('/blogs')
    } else {
      res.render('blogs/update', {
        blog:blog
      });
    }    
  });
});

// Update blog PUT
router.put('/:id', (req, res) => {
  Blog.findOne({
    _id: req.params.id
  })
  .then((blog) => {
    let allowComments;
  
    if(req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    blog.title = req.body.title;
    blog.body = req.body.body;
    blog.status = req.body.status;
    blog.allowComments = allowComments;

    blog.save()
      .then((blog) => {
        res.redirect('/dashboard');
      }); 
  });
});

// Blog Delete 
router.delete('/:id', (req, res) => {
  Blog.deleteOne({
    _id: req.params.id
  })
  .then(() => {
    res.redirect('/dashboard');
  })
});

// Show blog
router.get('/:id', (req, res) => {
  Blog.findOne({
    _id: req.params.id
  })
  .populate('comments.commentUser')
  .populate('user')
  .then((blog) => {
    if(blog.status == 'public') {
      res.render('blogs/show', {blog: blog});
    } else {
      if(req.user) {
        if(req.user.id == blog.user._id) {
          res.render('blogs/show', {blog: blog});
        } else {
          res.redirect('/blogs');
        }
      } else {
        res.redirect('/blogs');
      }
    }
  })
});

// Add comment POST
router.post('/comments/:id', (req, res) => {
  Blog.findOne({
    _id: req.params.id
  })
  .then((blog) => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    }

    blog.comments.unshift(newComment);

    blog.save()
      .then((blog) => {
        res.redirect(`/blogs/${blog.id}`);
      });
  });
});

// List blogs from a specific user
router.get('/user/:userID', (req, res) => {
  Blog.find({
    user: req.params.userID,
    status: 'public'
  })
  .populate('user')
  .then((blogs) => {
    res.render('blogs/index', {
      blogs: blogs
    });
  });
}); 

// List blogs from the logged in user
router.get('/my/:userID',ensureAuthenticated, (req, res) => {
  Blog.find({
    user: req.user.id
  })
  .populate('user')
  .then((blogs) => {
    res.render('blogs/index', {
      blogs: blogs
    });
  });
});

module.exports = router;