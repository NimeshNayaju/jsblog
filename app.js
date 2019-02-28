const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const keys = require('./config/keys');
const User  = require('./models/user');

// Load passport config
require('./config/passport')(passport);

// Load routes
const auth = require('./routes/auth'); 

// Map global promises
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.log(err);
});

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to the home page!');
});

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global variable
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Use routes
app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server starting on ${port}.`)
});

