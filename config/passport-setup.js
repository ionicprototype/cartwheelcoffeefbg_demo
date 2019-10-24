const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done)=> {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        //OPTIONS FOR GOOGLE STRATEGY
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    // PASSPORT CALLBACK FUNCTION
    console.log('passport callback fired');
    // RETRIEVE USER PROFILE FROM GOOGLE
    User.findOne({googleID: profile.id}).then((currentUser) => {
        // USER IN DATABASE
        // @DESC IF USER FOUND IN DATABASE, ALLOW LOGIN
        if(currentUser){
            done(null, currentUser);
        } else {
        // @DESC IF USER NOT FOUND IN DATABASE, DETERMINE IF NEW USER IS ALLOWED
            // @DESC IF NEW USER IS NOT ALLOWED, RETURN FALSE AND CAUSE REDIRECT WITHOUT LOGIN
            if(keys.google.allowNewUser === false) {
                done(null, false);
            // @DESC IF NEW USER IS ALLOWED, ADD TO DATABASE
            } else {
                new User({
                    username: profile.displayName,
                    googleID: profile.id
                }).save().then((newUser) => {
                    console.log('New user created: ' + newUser);
                    done(null, newUser);
                });
            }
        }
    });
}));   