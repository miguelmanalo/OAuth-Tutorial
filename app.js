const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const passportSetup = require("./config/passport-setup");
const keys = require('./config/keys');
const queryController = require("./server/controllers/queryController");
const cookieSession = require('cookie-session');
const passport = require('passport')

// handle parsing request body and cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// we want passport to initialize and then use cookies
// this has to be run early on here in app
app.use(passport.initialize());
app.use(passport.session());

// use auth-routes at /auth
app.use('/auth', authRoutes);

// use profile routes
app.use('/profile', profileRoutes);

// set up view engine
app.set('view engine', 'ejs');

// use cookieSeession to make sessions
// encrypts cookie and makes sure it lives just a day long
app.use(cookieSession({
  // one day in milliseconds
  maxAge: 24 * 60 * 60 * 1000,
  // hide the secret key in the keys file
  keys: [keys.session.cookieKey],
}));



// add a new unique user record to db
app.post(
  "/newUser",
  queryController.addNewUser
);

// get one user by googleid
app.get(
  "/getOneUser/:googleid",
  queryController.getOneUser, (req, res, next) => {
   console.log("fired in getOneUser app.js")
   res.sendStatus(200)
  }
);

app.listen(4444, () => {
  console.log('app now listening for reqs on port 4444')
});

// create home route
app.get('/', (req, res) => {
  res.render('home');
});