// create instance of a router, attach all these routes to it
const router = require('express').Router();
const passport = require('passport')

//auth login
router.get('/login', (req, res) => {
    res.render('login', {
      user: req.user
    })
})

// auth logout
router.get('/logout', (req, res) => {
  // handle with passport
  req.logout();
  res.redirect('/');
  res.send('logging out');
})

//auth with google // we will use passport here
// the google arg in authenticate will redirect to google consent screen
router.get('/google', passport.authenticate("google", {
  scope: ["profile"]
}));

// before the func fires, we pass in pass.auth again
// we pass fire it again bc this time around we have a code in the URL
// passport can see that we now have the code, we have been to the consent screen
// we echange this code for profile info
// cb route for google to redirect to
router.get("/google/redirect", passport.authenticate('google'), (req, res) => {
  // res.send(req.user);
  console.log('req.user in auth-routes', req.user.rows[0]);
  // res.locals.user = req.user
  // console.log("res.locals.user in auth-routes", res.locals.user)
  res.redirect('/profile/')
});

module.exports = router;