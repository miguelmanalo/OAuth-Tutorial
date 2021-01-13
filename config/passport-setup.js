const passport = require('passport');
// you can have many strategies
const GoogleStrategy = require('passport-google-oauth20');
const fetch = require('node-fetch');
const queryController = require("../server/controllers/queryController");

// import the keys file that you add to gitignore
const keys = require('./keys');

// create serialized user ids
passport.serializeUser((user, done) => {
 done(null, user.id)

});

// passport.authenticate('google')
// 1st param strategy, 2nd param a cb func
passport.use(
  new GoogleStrategy({
    // opts for the goog strategy
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
  }, (accessToken, refreshToken, profile, done) => {
      //accessToken received from Google -WE DONT CARE ABOUT THIS
      //refresh refresh's access token as access token expires - WE DONT CARE ABOUT THIS
      //profile is the code we get back from Google. It's bringing back the profile
      //we call done when done with the callback function. not sure why. just do it.
    // passport cb func
    // cb takes in lots of params, 1st is access token, 2nd is refreshtoken
    // 3 is profile info, 4th is func called done
    console.log('i like turtles')
    // console.log('accessToken', accessToken);
    // console.log('profile', profile);
    // console.log('refreshToken', refreshToken);
    // console.log('done', done);
    const body = {
      googleid: profile.id,
      usernam: profile.displayName
    }

    // we want to see if the user exists already
    // if they do exist already console log it
    // we have to do ocntrol flow somewhere here
    // that checks to see if res.locals.foundOne is empty or is undefined
    // if it is empty, do the Add Fetch instead

    fetch(`${keys.baseURL.localH}/getOneUser/:googleid`, (req, res) => {
      console.log('inside the fetch in passport-setup')
      if (res.locals.foundOne === '' || res.locals.foundOne === undefined ) {
        console.log("we found locals, now do something")
      }
      else {
         // console.log('body before fetch', body)
    fetch(`${keys.baseURL.localH}/newUser`, {
      headers: { "Content-type": "application/json" },
      body: JSON.stringify( body ),
      method: "POST",
    }).then((res) => {
      res.text();
      console.log('res', res);
    }).then(body => console.log('res body', body))


      }
    })

    
   
    ;
  })
);