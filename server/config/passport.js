//configuring the strategies for passport


// load all the things we need
var FacebookStrategy = require('passport-facebook').Strategy;
var User            = require('../model/user');

// expose this function to our app using module.exports
module.exports = function(passport,db,pgp) {
    // load up the user model
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log(user);
		if(user.length > 0)
			done(null, user[0].sfid);
		else
			done(null, 'nouser');

    });

    // used to deserialize the user
    passport.deserializeUser(function(sfid, done) {
        console.log(sfid + "is deserialized");
        User.findBysfid(sfid, function(err, user) {
            done(err, user);
        });
    });

    
    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

            // pull in our app id and secret from our auth.js file
            clientID        : process.env.FB_clientID,
            clientSecret    : process.env.FB_clientSecret,
            callbackURL     : process.env.BASE_URL+'auth/facebook/callback',
            profileFields: ['id', 'displayName', 'link', 'photos', 'emails'],
            enableProof: true
        },

        // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {
             // asynchronous
            process.nextTick(function() {

                // find the user in the database based on their facebook id
                User.findOne(profile.emails[0].value, function(err, isNotAvailable,user) {
                    console.log(user,"user Details");
                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(null, false, { message: err });

                    // if the user is found, then log them in
                    if (!isNotAvailable) {
                        return done(null, user); // user found, return that user
                    } else {
                        return done(null, false, { message: 'User does not exists' });
                    }

                });
            });
        }));

    };
