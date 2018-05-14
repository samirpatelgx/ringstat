const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dynamoose = require("dynamoose");
const keys = require("../config/keys.js");

const User = dynamoose.model("users");
const uuidv1 = require("uuid/v1");

passport.serializeUser((user, done) => {
  done(null, user[0].userId);
});

passport.deserializeUser((id, done) => {
  User.get({ userId : id}, (err, user) => {
    debugger;
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: "/auth/google/callback"
  }, (accessToken, refreshToken, profile, done) => {
    User.query( { googleId: { eq: profile.id } },(err, existingUser) => { 
      if (existingUser.count == 0) {
        new User({ userId: uuidv1(), googleId: profile.id }).save()
        .then(user => done(null, user));
      } else {
        debugger
        done(err, existingUser);
      }
    });
  })
);                                                                                                                                                                                                                                                                                                                                                                                                                          