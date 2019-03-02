const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const keys = require('./config/keys');
const User  = require('./models/user');

// Load passport config
require('./config/passport')(passport);

// Load routes
const auth = require('./routes/auth'); 
const index = require('./routes/index');
const blogs = require('./routes/blogs');

// Handlebars helpers
const {truncate, stripTags} = require('./helpers/hbs');

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handlebars middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate: truncate, 
    stripTags: stripTags
  },
  defaultLayout: 'main'
}));

// View engine setup
app.set('view engine', 'handlebars');

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

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', index);
app.use('/auth', auth);
app.use('/blogs', blogs);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server starting on ${port}.`)
});

