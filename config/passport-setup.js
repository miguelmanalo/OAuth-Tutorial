const passport = require('passport');
// you can have many strategies
const GoogleStrategy = require('passport-google-oauth20');
const fetch = require('node-fetch');
const queryController = require("../server/controllers/queryController");
const db = require("../models/queryModels");

// import the keys file that you add to gitignore
const keys = require('./keys');

// create serialized user ids
passport.serializeUser((user, done) => {
  // we want the SQL-created id of the user we query for
  console.log('serializeUser user.id', user.rows[0].id)
  //user.id is being stuffed into the cookie;
  // console.log('req.session.passport.user in SERIAL', req);
  done(null, user.rows[0].id);

});

passport.deserializeUser(async (id, done) => {
  // we want the SQL-created id of the user we query for
  console.log('deserializeUser user.id', id)
  const user = await db.query('SELECT * FROM "public"."users" WHERE "id" = $1', [id])
  console.log('our user inside deSERIAL is...', user)
  done(null, user)
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

    
    // console.log('body ln 51', body)
    const checkUser = async () => {
      const user = await db.query('SELECT * FROM "public"."users" WHERE "oauth_data" = $1', [body.googleid])
      console.log('user inside', user.rows[0])
      if (user.rows[0] !== undefined) {
        console.log('user is: ', user.rows[0]);
        console.log("starting done function, get user")
        done(null, user);
    //we'll do something here
      } else {
        // we do our query to create a new user
        const newUser = await db.query(`INSERT INTO users (name, oauth_data) VALUES ($1, $2) RETURNING *`, [body.usernam, body.googleid]);
       console.log("This SHOULD be the users info", newUser.rows[0])
       console.log("this is new user", newUser.rows)
          // console.log("starting done function create new user")
          console.log("user.rows[0]", newUser.rows[0])
          // console.log('res in ps-setup else', res)
          done(null, newUser)
          // console.log('res', res);
        }
      };
    checkUser();

  //   fetch(`${keys.baseURL.localH}/getOneUser/:googleid`, (req, res) => {
  //     console.log('inside the fetch in passport-setup')
  //     if (res.locals.foundOne === '' || res.locals.foundOne === undefined ) {
  //       console.log("we found locals, now do something")
  //     }
  //     else {
  //        // console.log('body before fetch', body)
    // fetch(`${keys.baseURL.localH}/newUser`, {
    //   headers: { "Content-type": "application/json" },
    //   body: JSON.stringify( body ),
    //   method: "POST",
    // }).then((res) => {
    //   res.text();
    //   console.log('res', res);
    // }).then(body => console.log('res body', body))


  // }
    // })

    
   
    // fetch(`${keys.baseURL.localH}/newUser`, {
    //   headers: { "Content-type": "application/json" },
    //   body: JSON.stringify( body ),
    //   method: "POST",
    // }).then((res) => {
    //   res.text();
    //   console.log('res', res);
    // }).then(body => console.log('res body', body))
  })
);