const express = require('express');
const authRoutes = require('./routes/auth-routes')
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const passportSetup = require("./config/passport-setup")
const keys = require('./config/keys')
const queryController = require("./server/controllers/queryController");

// handle parsing request body and cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// use auth-routes at /auth
app.use('/auth', authRoutes);

// set up view engine
app.set('view engine', 'ejs');

//connect to postgres???
// add a new unique user record to db
app.post(
  "/newUser",
  queryController.addNewUser
);

// get one user by googleid
app.get(
  "/getOneUser/:googleid",
  queryController.getOneUser, (req, res, next) => {
   console.log("fired")
   
  }
);

app.listen(4444, () => {
  console.log('app now listening for reqs on port 4444')
});

// create home route
app.get('/', (req, res) => {
  res.render('home');
});